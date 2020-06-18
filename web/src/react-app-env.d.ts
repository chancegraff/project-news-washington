/// <reference types="react-scripts" />

declare module '*.scss' {
    const content: {[className: string]: string};
    export default content;
}

interface IArticle {
    id: number;
    title: string;
    url: string;
    thumbnail: string;
    publishedAt: string;
}

interface IUser {
    id: number;
    email: string;
}

interface Credentials {
    email: string;
    password: string;
}

interface IRegisterForm extends Credentials {}

interface ILoginForm extends Credentials {}
