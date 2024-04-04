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

        let query = 'SELECT * FROM product';

        let values: any[] = [dobFrom, dobTo];

        const [result, fields] = await connection.execute(query, values);

        connection.end();

        if (Array.isArray(result)) {
            result.forEach((img: any) => {
                if (img && img.img) {
                    img.img = "data:image/webp;base64," + Buffer.from(img.img, 'binary').toString('base64');
                }
            });
        }

        return NextResponse.json({ fields: fields.map(f => f.name), result });

    } catch (error) {
        return NextResponse.json({ message: 'Connection Error' + error }, { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const action = formData.get('action') as string || null;

    switch (action) {
        case "add":
            return addProduct(formData);
        case "delete":
            return deleteProduct(formData);
        case "update":
            return updateProduct(formData);
        default:
            return NextResponse.json({ message: 'Invalid action' }, { status: 401 });
    }
}

async function addProduct(formData: FormData) {
    const id = formData.get('id') as string || null;
    const name = formData.get('name') as string || null;
    const des = formData.get('des') as string || null;
    const image = formData.get('img') as File || null;
    const price = formData.get('price') as string || null;

    try {
        const connection = await mysql.createConnection(connectionParams);

        const [checkid] = await connection.execute('SELECT id FROM product WHERE id = ?', [id]);

        if (Array.isArray(checkid) && checkid.length > 0) {
            connection.end();
            return NextResponse.json({ message: 'Sorry, ID already used' }, { status: 402 });
        }

        const buffer = Buffer.from(await image.arrayBuffer());

        let query = 'INSERT INTO product (id, name, des, img, price) VALUES (?, ?, ?, ?, ?)';
        const values = [id, name, des, buffer, price];
        await connection.execute(query, values);

        connection.end();

        return NextResponse.json({ message: 'Data added successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to add data: ' + error }, { status: 402 });
    }
}

async function deleteProduct(formData: FormData) {
    const id = formData.get('id') as string || null;

    try {
        const connection = await mysql.createConnection(connectionParams);
        let query = 'DELETE FROM product WHERE id = ?';

        await connection.execute(query, [id]);
        connection.end();

        return NextResponse.json({ message: 'Data deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete data: ' + error }, { status: 403 });
    }
}

async function updateProduct(formData: FormData) {
    const id = formData.get('id') as string || null;
    const name = formData.get('name') as string || null;
    const des = formData.get('des') as string || null;
    const image = formData.get('img') as File || null;
    const price = formData.get('price') as string || null;

    try {
        if (!id) {
            return NextResponse.json({ message: 'ID is required for updating data' }, { status: 404 });
        }

        const connection = await mysql.createConnection(connectionParams);
        const buffer = Buffer.from(await image.arrayBuffer());

        if (!image || image.size == 0) {
            let query = 'UPDATE product SET name = ?, des = ?, price = ? WHERE id = ?';
            await connection.execute(query, [name, des, price, id]);
        } else {
            let query = 'UPDATE product SET name = ?, des = ?, price = ?, img = ? WHERE id = ?';
            await connection.execute(query, [name, des, price, buffer, id]);
        }
        
        connection.end();

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update product: ' + error }, { status: 404 });
    }
}
