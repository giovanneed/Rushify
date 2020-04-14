import { Component,OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


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


  currentImage: any;

  products : Product[] = Array();

  formProduct = {}

  newProductFilePicURL : ArrayBuffer
 	newProductFilePicPicture: File

   loading: HTMLIonLoadingElement = null;


  constructor(private httpClient: HttpClient, 
    public alertController: AlertController, 
    public loadingController: LoadingController, private camera: Camera) {}

 

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

   /* if (this.checkField(title,"Name") == false || this.checkField(desc,"Description")  == false) {
        return
    }*/


    

    this.presentLoading()


    let newProduct = new Product()
    //console.log(this.newProductFilePicURL.toString())

   // this.presentAlertError("Image", this.newProductFilePicURL.toString());

    

 
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

    console.log('shouyld call dismiss');

    

    var headers = new HttpHeaders()
    .set("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");


    var url = RushAPI.getInstance().baseURL + '/shopify/products'

   this.httpClient.post(url,newProduct.toJSON(),{headers}).subscribe(
      val => {

        console.log("finish call")

          
       },
       response => { console.log("PUT call in error", response); 
       this.presentAlertError("Ops", "Something went wrong!");

      },
       () => { 
        this.dissmissLoading();

        this.presentAlertError("Great", newProduct.title + " was created!");
        this.clearForm();
        this.getItemsFromShopify()
         console.log("The PUT observable is now completed.");
        }
   );


  }

  addExtra(){

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 5000,
    });
    
    await this.loading.present();

  }

  async dissmissLoading(){

    console.log('Loading dismissed!');

    await this.loading.onDidDismiss();
    this.loading = null

  }



  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Click the backdrop to dismiss early...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
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
       response => { 

         console.log("PUT call in error", response); 
         console.log(response.toString()); 


       },
        () => { console.log("The PUT observable is now completed."); }


    );
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/png;base64,' + imageData;
      this.newProductFilePicURL =  imageData;
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });
  }

}
