import NetworkService from '../network.service'

export default class CardsApi {
  async fetchAllCards () {
    return await (new NetworkService('https://api.magicthegathering.io/v1')).get('/cards')
  }
}
