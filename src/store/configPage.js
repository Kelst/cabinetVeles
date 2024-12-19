import { create } from 'zustand'
import $api from '../http'

const parseHTML = (htmlString) => {
  const cleaned = htmlString
    .replace(/^<>/, '')
    .replace(/<\/>$/, '')
    .replace(/\\"/g, '"')
    .trim();
  return cleaned;
};

const useConfigPage = create((set) => ({
  configCabinet: {
    logo:"",
    logo_min_navigation:"",
    type: '',
    home: {
      switchLogin: true,
      editPhone: true,
      reloadSesion: true,
      changePassword: true,
      clearMac: true,
      setCredit: true,
      additionalService: true,
      staticIp: true,
      tariffPlans: true
    },
    additional: {
      showTask: true,
      addFriend: true,
      showOffice: true,
      tv: true
    }
  },
  
  news: [],
  faq: [],
  payments: [],
  imageUrl:{},
  async getConfigCabinet(provider) {
    try {
      const response = await $api.get(`http://194.8.147.150:5000/api/getConfigCabinet?typePage=${provider}`)
      const result = response.data.configCabinet
      set({ configCabinet: result })
      return result
    } catch (error) {
      console.error("Error getting config:", error)
      return null
    }
  },
  async getImageUrl(provider) {
    try {
      const response = await $api.get(`http://194.8.147.150:5000/api/getImageUrl?type=${provider}`)
      const result = response.data
      console.log(result,"RESULLLT");
      
      set({ imageUrl:result })
      return result
    } catch (error) {
      console.error("Error getting ImageUrl:", error)
      return null
    }
  },
  async getNews(provider) {
    try {
      const response = await $api.get(`http://194.8.147.150:5000/api/getNewsById?provider=${provider}`)
      const newsData = response.data.map(item => ({
        provider: item.provider,
        title: item.title,
        url: item.image?.url || '',
        date: item.date,
        author: item.author,
        category: item.category,
        preview: item.preview,
        content: item.content
      }))
      set({ news: newsData })
      return newsData
    } catch (error) {
      console.error("Error getting news:", error)
      return null
    }
  },

  async getFaq(provider) {
    try {
      const response = await $api.get(`http://194.8.147.150:5000/api/getFaq?provider=${provider}`)
      const faqData = response.data.providerResult.map(item => ({
        id: item._id,
        provider: item.provider,
        title: item.title,
        description: item.description,
        displayFaq: item.displayFaq
      }))
      set({ faq: faqData })
      return faqData
    } catch (error) {
      console.error("Error getting FAQ:", error)
      return null
    }
  },

  async getPayments(provider) {
    try {
      const response = await $api.get(`http://194.8.147.150:5000/api/getPaymentsModel?provider=${provider}`)
      const paymentsData = response.data.paymentsResult
        .filter(item => item.show)
        .map(item => ({
          name: item.name,
          url: item.url,
          imageUrl: item.img?.url || ''
        }))
      set({ payments: paymentsData })
      return paymentsData
    } catch (error) {
      console.error("Error getting payments:", error)
      return null
    }
  }
}))

export default useConfigPage