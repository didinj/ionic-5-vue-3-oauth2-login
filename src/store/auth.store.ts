import {AuthenticationError, AuthService} from "@/services/auth.service";
import { TokenService } from "@/services/token.service";

const state = {
    authenticating: false,
    accessToken: TokenService.getToken(),
    authenticationErrorCode: 0,
    authenticationError: "",
    refreshTokenPromise: null
};

const getters = {
    authenticationErrorCode: (state: { authenticationErrorCode: any }) => {
        return state.authenticationErrorCode;
    },

    authenticationError: (state: { authenticationError: any }) => {
        return state.authenticationError;
    },

    authenticating: (state: { authenticating: any }) => {
        return state.authenticating;
    }
};

const actions = {
    async signIn(context: any, signInData: any) {
        context.commit("signInRequest");
        return new Promise((resolve, reject) => {
            AuthService.signIn(signInData).then(res => {
                context.commit("signInSuccess", res);
                resolve(res);
            }).catch(err => {
                if (err instanceof AuthenticationError) {
                    context.commit("signInError", {
                        errorCode: err.errorCode,
                        errorMessage: err.message
                    });
                    reject(err.message);
                }
            });
        });
    },

    signOut(context: any) {
        context.commit("signOutRequest");
        return new Promise((resolve) => {
            AuthService.signOut();
            resolve();
        });
    },

    refreshToken(context: any, state: { refreshTokenPromise: any }) {
        if (!state.refreshTokenPromise) {
            const p = AuthService.refreshToken();
            context.commit("refreshTokenPromise", p);

            p.then(
                response => {
                    context.commit("refreshTokenPromise", null);
                    context.commit("loginSuccess", response);
                },
                error => {
                    context.commit("refreshTokenPromise", error);
                }
            );
        }

        return state.refreshTokenPromise;
    },

    async signup(context: any, {email, password, name}: any) {
        try {
            await AuthService.signup(email, password, name);
            context.commit("processSuccess");
            return true;
        } catch (e) {
            if (e instanceof AuthenticationError) {
                context.commit("signInError", {
                    errorCode: e.errorCode,
                    errorMessage: e.message
                });
            }
            return false;
        }
    },

    setAuthenticatingStatus(context: any, status: any) {
        context.commit("setAuthenticatingStatus", status);
    },
};

const mutations = {
    signInRequest(state: {
        authenticating: boolean;
        authenticationError: string;
        authenticationErrorCode: number;
    }) {
        state.authenticating = true;
        state.authenticationError = "";
        state.authenticationErrorCode = 0;
    },

    signInSuccess(state: {
        accessToken: any;
        authenticating: boolean;
    }, accessToken: any) {
        state.accessToken = accessToken;
        state.authenticating = false;
    },

    signInError(state: {
        authenticating: boolean;
        authenticationErrorCode: any;
        authenticationError: any;
    }, {errorCode, errorMessage}: any) {
        state.authenticating = false;
        state.authenticationErrorCode = errorCode;
        state.authenticationError = errorMessage;
    },

    signOutRequest(state: { authenticating: boolean }) {
        state.authenticating = false;
    },

    refreshTokenPromise(state: { refreshTokenPromise: any }, promise: any) {
        state.refreshTokenPromise = promise;
    },

    processSuccess(state: { authenticating: boolean }) {
        state.authenticating = false;
    },

    setAuthenticatingStatus(state: { authenticating: any }, status: any) {
        state.authenticating = status;
    }
};

export const auth = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
