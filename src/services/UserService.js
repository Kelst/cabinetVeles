import $api from "../http";

export default class UserService {
    static async checkUser() {
        const response = await $api.get('/checkUser')
        console.log(response);
        if (response.status == '200') {
            return response.data.isAuth
        } else {
            return false
        }
    }

    static async fetchUsers(uid) {
        try {
            const response = await $api.get(`https://cabinet.biz.ua/api/getDataUid?uid=${uid}&provider=${'Opticom'}`);
            const responseTariff = await $api.get(`https://cabinet.biz.ua/api/getListTariffAvaible?uid=${uid}`);
            console.log(response.data);
            const result={...response.data,subLogin:[...response.data.subLogin],...responseTariff.data}
            console.log(result,"            console.log(response.data);");

            return result;
        } catch (error) {
            console.error('Помилка при отриманні даних користувача:', error);
            throw error;
        }
    }
}
