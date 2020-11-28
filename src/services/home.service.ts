import ApiService from "./api.service";

class ResponseError extends Error {
    errorCode: any;
    errorMessage: any;
    constructor(errorCode: any, message: string | undefined) {
        super(message);
        this.name = this.constructor.name;
        if (message != null) {
            this.message = message;
        }
        this.errorCode = errorCode;
    }
}

const HomeService = {
    secretArea: async function() {
        try {
            return ApiService.get("/secret");
        } catch (error) {
            throw new ResponseError(
                error.status,
                error.error.message
            );
        }
    }
}

export { HomeService, ResponseError };
