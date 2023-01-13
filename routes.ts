import { Router, Request, Response } from "express";
import { Item } from "./item";

let itemArray: Item[] = [
  { id: 1, quantity: 20, price: 10, product: "Eggs", isActive: true },
  { id: 2, quantity: 21, price: 11, product: "Coffee", isActive: true },
  { id: 3, quantity: 22, price: 12, product: "Butter", isActive: true },
  { id: 4, quantity: 23, price: 13, product: "Milk", isActive: true },
  { id: 5, quantity: 24, price: 14, product: "Cheese", isActive: true },
  { id: 6, quantity: 25, price: 15, product: "Salad", isActive: true },
];

export const itemRouter = Router();
// we just created a router!

itemRouter.get("/", async (req: Request, res: Response): Promise<Response> => {
  if (req.query.maxPrice !== undefined) {
    let underArray = itemArray.filter(
      (x) => x.price <= Number(req.query.maxPrice) && x.isActive
    );
    return res.status(200).json(underArray);
  }
  //prefix is the parameter
  else if (req.query.prefix !== undefined) {
    let startsWithArray = itemArray.filter(
      (x) => x.product.startsWith(String(req.query.prefix)) && x.isActive
    );
    return res.status(200).json(startsWithArray);
  } else if (req.query.pageSize !== undefined) {
    return res
      .status(200)
      .json(
        itemArray.filter((x) => x.isActive).slice(0, Number(req.query.pageSize))
      );
  } else {
    return res.status(200).json(itemArray.filter((x) => x.isActive));
  }
});

// URI Parameter is when we want one specific thing. We use req.params.id
itemRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<Response> => {
    let itemIWantToFind = itemArray.find((x) => x.id === Number(req.params.id));

    if (itemIWantToFind === undefined) {
      return res.status(404).send("ID not found");
    } else {
      return res.status(200).json(itemIWantToFind);
    }
  }
);

itemRouter.post("/", async (req: Request, res: Response): Promise<Response> => {
  let newItem: Item = {
    id: GetNextId(),
    product: String(req.body.product),
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    isActive: true,
  };
  itemArray.push(newItem);

  return res.status(201).json(newItem);
});

itemRouter.put(
  "/:id",
  async (req: Request, res: Response): Promise<Response> => {
    // find the item by the id
    let itemIWantToFind = itemArray.find((x) => x.id === Number(req.params.id));
    // update the properties of the item based on what is sent in the body of the request
    if (itemIWantToFind !== undefined) {
      itemIWantToFind.price = Number(req.body.price);
      itemIWantToFind.product = String(req.body.product);
      itemIWantToFind.quantity = Number(req.body.quantity);
      itemIWantToFind.isActive = Boolean(req.body.isActive);
      // return a status of 200 with the updated item in json format
      return res.status(200).json(itemIWantToFind);
    } else {
      return res.status(404).send("Hey I didn't find it");
    }
  }
);

itemRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<Response> => {
    let itemIWantToFind = itemArray.find((x) => x.id === Number(req.params.id));
    if (itemIWantToFind === undefined) {
      return res.status(404).send("This does not exist");
    } else {
      // itemArray = itemArray.filter((x) => x.id !== Number(req.params.id));
      itemIWantToFind.isActive = false;
      // check to see if item is still in array!
      console.log(itemArray);
      return res.status(204).send("Deleted");
    }
  }
);

function GetNextId() {
  // ... = spread operator
  return Math.max(...itemArray.map((x) => x.id)) + 1;
}
