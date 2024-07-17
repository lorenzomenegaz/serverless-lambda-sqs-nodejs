export class RcsClient {
    constructor({client, api}) {
        this.client = client
        this.api = api
    }

    async perform({params}) {

        if (this.api == 'google') {
            try {
                return await this.client.sendTesterInvite(params, function(response) {
                    console.log(response);
                })
            } catch (error) {
                console.error("ERROR:", error.message);
                return Promise.reject()
            }
        }

        try {
            return await this.client.sendMessage(params)
        } catch (error) {
            console.error("ERROR:", error.message);
            return Promise.reject()
        }
        
    }

}

export default RcsClient