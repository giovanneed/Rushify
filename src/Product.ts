

export interface VarianteInterface {
    title: string;
    price: string;

 }
 

export interface ImageInterface {
   src: string;
}

export interface ProductInterface {
    title: string;
    body_html: string;
    product_type: string;
    image:  ImageInterface; 
    variants: [VarianteInterface]  
  
  }

export class Product {

    interface:  ProductInterface

    title = ""
    desc = ""
    price = ""
    cat = ""
    imageURL = ""

    public initWithJSON(json: Object){

        this.interface = json as ProductInterface

    }

    public initWith(title: string, description: string, price: string, category: string, imageBase64: ArrayBuffer) {
      this.title = title
      this.desc = description
      this.price = price
      this.cat = category

    
      console.log("new product")
      var enc = new TextDecoder();


      this.imageURL = imageBase64.toString().replace('data:image/png;base64,','')
    }

    public getImageURL(): String {
          var URL = "not image"

          if (this.interface.image != null) {
            URL = this.interface.image.src

          }

          return URL

    }


    public toJSON(): any {

        var JSON = {
          "product" : {
            "title" : this.title,
            "body_html" : this.desc,
            "vendor" : "Centennial Capstone App",
            "physical_product" : false,
            "product_type" : this.cat,
            "variants": [
              {
                "price": this.price,
                "requires_shipping": false,
              }],
            "images" : [
             { "attachment" : this.imageURL}
            ]
          }
        }

        return JSON
    }

   
  }
  