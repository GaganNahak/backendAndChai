class ApiError{
    constructor(statusCode,
        messege="Something Wrong",
        errors=[],
        stack=''
    ){
        super(messege)
        this.statusCode=statusCode
        this.messege=messege
        this.errors=errors
        if(stack){
            this.stack=stack
        }
    }
}


export {ApiError}