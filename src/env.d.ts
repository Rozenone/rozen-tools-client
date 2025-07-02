/// <reference types="vite/client" />

declare module "@/utils/CommUtils" {
  export function getImageUrl(url: string): string;
}

declare module "@/stores" {
  const useStore: () => {
    top: {
      aiConfig: {
        enabled: boolean;
        model: string;
        apiKey: string;
        baseUrl: string;
        temperature: number;
        maxTokens: number;
      };
      leftDrawerOpen: boolean;
      rightDrawerOpen: boolean;
      theme: "light" | "dark";
      fontSize: number;
      proxy: {
        enabled: boolean;
        host: string;
        port: string;
        username: string;
        password: string;
        protocol: string;
      };
      toggleLeftDrawer: () => void;
      toggleRightDrawer: () => void;
      setTheme: (theme: "light" | "dark") => void;
      setFontSize: (size: number) => void;
      setProxy: (config: {
        protocol: string;
        enabled: boolean;
        host: string;
        port: string;
        username: string;
        password: string;
      }) => void;
      setAIConfig: (config: {
        enabled: boolean;
        apiKey: string;
        baseUrl: string;
        model: string;
        temperature: number;
        maxTokens: number;
      }) => void;
    };
    setaico;
  };
  export default useStore;
}
