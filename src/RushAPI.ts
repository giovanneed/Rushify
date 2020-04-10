export class RushAPI {
    private static instance: RushAPI;
  
    //Amazon
    public baseURL= "http://3.16.149.130:3000";

    //public baseURL= "localhost:3000";

   


  
  
    
  
    private constructor() {
    }
  
    static getInstance(): RushAPI {
      if (!RushAPI.instance) {
        RushAPI.instance = new RushAPI();
  
      }
  
      return RushAPI.instance;
    }


  }