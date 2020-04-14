export class RushAPI {
    private static instance: RushAPI;
  

    //Android
    //public baseURL= "http://10.0.0.2:3000";


    //Amazon
    //public baseURL= "http://3.16.149.130:3000";


    //Local
    public baseURL= "http://localhost:3000";

   
    //iPhone
    //public baseURL= "http://192.168.11.24:3000";


  
  
    
  
    private constructor() {
    }
  
    static getInstance(): RushAPI {
      if (!RushAPI.instance) {
        RushAPI.instance = new RushAPI();
  
      }
  
      return RushAPI.instance;
    }


  }