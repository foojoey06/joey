export interface IDBSettings {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
}

export const GetDBSettings = (): IDBSettings => {

    return {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'project',
    }

}