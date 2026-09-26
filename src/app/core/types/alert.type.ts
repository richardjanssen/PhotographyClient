
export interface Toaster {
    type: 'success' | 'info' | 'warning' | 'danger', 
    msg: string, 
    timeout: number
}