import { Component,OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import {Observable} from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Order } from 'src/Order';
import { RushAPI} from '../../RushAPI';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  orders : Order[] = Array();


  constructor(private httpClient: HttpClient, public alertController: AlertController) {}

  ngOnInit() {

    this.getOrdesFromShopify()
   }


   updateOrderStatus(order: Order){
     order.updateStatus()
     console.log("order status was updated")
     this.updateOrder(order)
   }

   updateOrder(order: Order){

    var headers = new HttpHeaders()
    .set("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");


    var url = RushAPI.getInstance().baseURL + '/shopify/orders/' + order.id


   this.httpClient.post(url,order.toUpdateJSON(),{headers}).subscribe(
      val => {


          console.log("RESPONSE: " + val.toString())
          //this.presentAlertError("Great", newProduct.interface.title + "was created!");

          //this.getItemsFromShopify()
       },
       response => { console.log("PUT call in error", response); },
       () => { console.log("The PUT observable is now completed.");}
   );


  }

  getOrdesFromShopify() {

    var url = RushAPI.getInstance().baseURL + '/shopify/orders' 


    this.httpClient.get(url).subscribe(

        val => { 

          console.log("start parse");

          this.orders = Array()

          for (var i = 0; i < val["orders"].length; i++) {
            console.log(val["orders"][i]);
            let modelOrder = val["orders"][i]
            console.log("model order => " + modelOrder);
            let order = new Order()
            order.initWithJSON(modelOrder as Object)
            this.orders.push(order)

         }


         
        },
       response => { console.log("PUT call in error", response); 
        // this.presentAlertError("Error", "API Error!");

       },
        () => { console.log("The PUT observable is now completed."); }


    );
  }

}
