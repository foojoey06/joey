import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';
import { GetDBSettings } from '@/app/sharedCode/common';

let connectionParams = GetDBSettings();

export async function GET(request: NextRequest) {
    let dobFrom = '';
    let dobTo = '';

    try {
        dobFrom = request.nextUrl!.searchParams!.get('dobfrom')!;
        dobTo = request.nextUrl!.searchParams!.get('dobto')!;

        console.log({ dobFrom, dobTo });

        const connection = await mysql.createConnection(connectionParams);

        let query = "SELECT * FROM user";
        const [result, fields] = await connection.execute(query);

        connection.end();

        return NextResponse.json({ fields: fields.map(f => f.name), result });
    } catch (error) {
        return NextResponse.json({ message: 'Connection Error' + error }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const action = formData.get('action') as string || null;

    switch (action) {
        case "login":
            return login(formData);
        case "register":
            return register(formData);
        default:
            return NextResponse.json({ message: 'Invalid action' }, { status: 501 });
    }

}

export async function register(formData: FormData) {
    const username = formData.get('username') as string | null;
    const password = formData.get('password') as string | null;
    const email = formData.get('email') as string | null;

    try {
        const connection = await mysql.createConnection(connectionParams);

        let query = 'SELECT * FROM user WHERE username = ?';
        const [rows] = await connection.execute(query, [username]);

        if (Array.isArray(rows) && rows.length > 0) {
            connection.end();
            return NextResponse.json({ message: 'Username already used, please try another username' }, { status: 502 });
        }

        query = 'INSERT INTO user (username, password, email) VALUES (?, ?, ?)';
        await connection.execute(query, [username, password, email]);

        connection.end();

        return NextResponse.json({ message: 'Registration successful' });
    } catch (error) {
        return NextResponse.json({ message: 'Error for Register' }, { status: 502 });
    }
}

export async function login(formData: FormData) {
    const username = formData.get('username') as string | null;
    const password = formData.get('password') as string | null;

    try {
        const connection = await mysql.createConnection(connectionParams);

        let query = 'SELECT * FROM user WHERE username = ?';
        const [rows] = await connection.execute(query, [username]);

        if (!Array.isArray(rows) || rows.length === 0) {
            connection.end();
            return NextResponse.json({ message: 'Invalid username/password' }, { status: 503 });
        }

        const user = rows[0] as { username: string, password: string };

        if (user.password !== password) {
            connection.end();
            return NextResponse.json({ message: 'Invalid username/password' }, { status: 503 });
        }

        connection.end();

        return NextResponse.json({ message: 'Login successful', username: user.username });
    } catch (error) {
        return NextResponse.json({ message: 'Error for Login' }, { status: 503 });
    }
}
