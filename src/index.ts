import express from "express";
import bodyParser from "body-parser";

export const app = express();

interface Balances {
    [key: string]: number;
}

interface User {
    id: string;
    balances: Balances;
}

interface Order {
    userId: string;
    price: number;
    quantity: number;
}

export const TICKER = "NIFTY";

const users: User[] = [{
    id: "1",
    balances: {
        "NIFTY": 1000,
        "USD": 100000
    }
}, {
        id: "2",
        balances: {
            "GOLD": 500,
            "USD": 50000
        }
    }
];

const bids: Order[] = [];
const asks: Order[] = [];

//placing a limit order
app.post("/order", (req: any, res: any) => {
    const side: "buy" | "sell" = req.body.side;
    const price: number = req.body.price;
    const quantity: number = req.body.quantity;
    const userId: string = req.body.userId;

    const remainingQty = fillOrders(side, price, quantity, userId);

    if (remainingQty === 0 ){
        res.json({
            filledQuantity: quantity
        });
        return;
    }

    if (side === "buy") {
        bids.push({
            userId,
            price,
            quantity: remainingQty
        });
        bids.sort((a,b) => a.price < b.price ? 1: -1);
    } else{
        asks.push({
            userId,
            price,
            quantity: remainingQty
        })
        asks.sort((a,b) => a.price < b.price ? -1: 1); 
    }

    res.json({
        filledQuantity: quantity - remainingQty
    })
})

app.get("/quote", (req: any, res: any) => {
    // todo balance
})

function flipBalance(side: string, price: number, quantity: number, userId: string): number {
    // todo balance
}

function fillOrders(side: string, price: number, quantity: number, userId: string): number {
    let remainingQty = quantity;

    if(side === "buy"){
        for (let i = asks.length - 1; i >=0; i--){
            if (asks[i].price <= price) {
                continue;
            }
            if (ask[i].quantity <= remainingQuantity){
                asks[i].quantity -= remainingQuantity;;
                flipBalance(asks[i].userId, userId, asks[i].quantity, price);
                return 0;
            } else {
                remainingQuantity -= asks[i]. quantity;
                flipBalance(asks[i].userId, userId, asks[i].quantity, price);
                asks.pop();
            }
        } else {
            for (let i = bids.length - 1; i >=0; i--){
                if (bids[i].price >= price) {
                    continue;
                }
                if (bids[i].quantity <= remainingQuantity){
                    bids[i].quantity -= remainingQuantity;
                    flipBalance(userId, bids[i].userId, remainingQuantity, price);
                    return 0;
                } else {
                    remainingQuantity -= bids[i].quantity;
                    flipBalance(userId, bids[i].userId, bids[i].quantity, price);
                    bids.pop();
                }
            }
        }

        return remainingQuantity;

    }
}