export class ShopifyCredentials {
    private static instance: ShopifyCredentials;
  
    //Amazon
    //public baseURL= "18.225.10.83:3000";


    private baseURL = "myshopify.com/admin/api"
    private apiVersion = "2020-04"
    private username= "45e07faf7bc41c6e83182f3af6a62a17"
    private key = "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"
    private store = "centennial-capstone-store"



  
  
    
  
    private constructor() {
    }
  
    static getInstance(): ShopifyCredentials {
      if (!ShopifyCredentials.instance) {
        ShopifyCredentials.instance = new ShopifyCredentials();
  
      }
  
      return ShopifyCredentials.instance;
    }

    public getURL(): String {

        return "https://" + this.username + ":" + this.key + "@" + this.store + "." + this.baseURL + "/" + this.apiVersion + "/"
    }
    
    public getHeader(string: String): String {
  
    
  
      return string;
    }
  

  }