import { attachView } from '@ionic/angular/providers/angular-delegate'

export interface StatusInterface {
    name: string;
    value: string
}

export interface ItemInterface {
    title: string;
    quantity: string
}
export interface CustomerInterface {
    first_name: string;
    last_name: string
}

export interface OrderInterface {
    id: string;
    name: string;
    created_at: string; 
    total_price: string;
    customer: CustomerInterface;
    line_items: [ItemInterface];
    note_attributes: [StatusInterface]
    
}


export class Order {

    interface:  OrderInterface
    id =""
    
    
    status = "Start"

    public initWithJSON(json: Object){

        this.interface = json as OrderInterface
        this.id = this.interface.id

        for (let att of this.interface.note_attributes) {
            if (att.name == "status") {
                this.status = att.value
            }
        }


    }

    public initWith(title: string, description: string, imageBase64: ArrayBuffer) {
      
    }

    public updateStatus() 
    {
        if (this.status == "Start") {
            this.status = "in Progress"
            return
        }

        if (this.status == "in Progress") {
            this.status = "Done"
            return
        }

        if (this.status == "Done") {
            this.status = "Ready"
            return
        }
    }

    public toUpdateJSON(): any {

        var JSON = {
          "order" : {
            "id" : this.id,
            "note_attributes" : [
             { 
               "name" : "status",
               "value": this.status
            }
            ]
          }
        }

        return JSON
    }

 
   
  }