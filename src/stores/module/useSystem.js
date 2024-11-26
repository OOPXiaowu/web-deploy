import { defineStore } from 'pinia';

export const useSystemStore = defineStore('System', () => {
    const systemInfo = {};



    return { systemInfo }
})

export default useSystemStore;
