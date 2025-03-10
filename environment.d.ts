declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_TOKEN: string;
      NODE_ENV?: "development" | "production";
      PORT?: any;
    }
  }
}

export {};
