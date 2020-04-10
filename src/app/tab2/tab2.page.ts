import { Component,OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import {Observable} from 'rxjs';
import { AlertController } from '@ionic/angular';



import { ShopifyCredentials } from '../../ShopifyCredentials';
import { Product, ProductInterface } from '../../Product';
import { RushAPI} from '../../RushAPI';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  products : Product[] = Array();

  formProduct = {}

  newProductFilePicURL : ArrayBuffer
 	newProductFilePicPicture: File



  constructor(private httpClient: HttpClient, public alertController: AlertController) {}


  ngOnInit() {

   this.getItemsFromShopify()
  }



  async presentAlertError(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: '',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  file: File;

  changeListener($event) : void {
    this.file = $event.target.files[0];

    var reader = new FileReader();
    this.newProductFilePicPicture = this.file
    reader.readAsDataURL(this.newProductFilePicPicture);
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.newProductFilePicURL = <ArrayBuffer>reader.result;
    }

  }

  checkField(value: string, name: string): boolean {

    if (value == null || value == "") {
      this.presentAlertError("Error", name +  " is mandatory!");
      return false
    } 

    return true
  }

  subForm(){

    console.log(this.formProduct["name"])
    console.log(this.formProduct["description"])



    let title =  this.formProduct["name"]
    let desc =  this.formProduct["description"]
    let price =  this.formProduct["price"]
    let category =  this.formProduct["category"]

    if (this.checkField(title,"Name") == false || this.checkField(desc,"Description")  == false) {
        return
    }


    let newProduct = new Product()
 
    newProduct.initWith(title,desc,price,category, this.newProductFilePicURL)


    console.log(newProduct.toJSON())

    this.createNewProduct(newProduct)

  } 

  clearForm(){

    this.formProduct["name"] = ""
    this.formProduct["description"] = ""
    this.formProduct["price"] = ""
    this.formProduct["category"] = ""
    this.newProductFilePicURL = null
    this.newProductFilePicPicture = null
 

  }

  createNewProduct(newProduct: Product){

    var headers = new HttpHeaders()
    .set("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");


    var url = RushAPI.getInstance().baseURL + '/shopify/products'

   this.httpClient.post(url,newProduct.toJSON(),{headers}).subscribe(
      val => {

        console.log("finish call")

          
       },
       response => { console.log("PUT call in error", response); },
       () => { 
        this.presentAlertError("Great", newProduct.title + " was created!");
        this.clearForm();
        this.getItemsFromShopify()
         console.log("The PUT observable is now completed.");
        }
   );


  }

  addExtra(){

  }


  getItemsFromShopify() {

   
    var url = RushAPI.getInstance().baseURL + '/shopify/products'
    console.log("URL" + url)
    
    this.httpClient.get(url).subscribe(

        val => { 

          console.log("start parse");

          this.products = Array()

          for (var i = 0; i < val["products"].length; i++) {
            console.log(val["products"][i]);
            let modelProduct = val["products"][i]
            console.log("model product => " + modelProduct);
            let product = new Product()
            product.initWithJSON(modelProduct as Object)
            this.products.push(product)

         }

        },
       response => { console.log("PUT call in error", response); 
        // this.presentAlertError("Error", "API Error!");

       },
        () => { console.log("The PUT observable is now completed."); }


    );
  }


}
