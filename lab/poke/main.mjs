import sqlite3 from 'sqlite3';

function createBowl({id, size, base, proteins = [], ingredients = [], quantity = 1, price = 0}) {
    return {id, size, base, proteins, ingredients, quantity, price};
}

function createOrder({id, userId, bowls = [], specialRequests = "", totalPrice = 0, discountApplied = false}) {
    return {id, userId, bowls, specialRequests, totalPrice, discountApplied};
}

function createUser({id, username, passwordHash, role = "customer", pastOrders = []}) {
    return {id, username, passwordHash, role, pastOrders};
}

function createDailyAvailability({id, maxR = 10, maxM = 10, maxL = 6, basePrices = {R: 9, M: 11, L: 14}}) {
    return {id, maxR, maxM, maxL, basePrices};
}

function createOrderCollection() {
    let orders = [];

    return {
        addOrder(order) {
            orders.push(order);
        },

        getOrderByUserId(userId) {
            return orders.filter(o => o.userId == userId);
        },

        applyDiscountToAll(percentage) {
            orders = orders.map(o => {
                const updatedPrice = o.totalPrice - (o.totalPrice * (percentage / 100));
                return {...o, totalPrice: Math.round(updatedPrice * 100) / 100};
            });
        },

        removeOrderById(orderId) {
            orders = orders.filter(o => o.id !== orderId);
        },

        getAllOrders() {
            return orders;
        },

        updateOrder(orderId, newData) {
            orders = orders.map(o => {
                if (o.id === orderId)
                    return {...o, ...newData};
                return o;
            });
        }
    };
}

function createBowlCollection() {
    let bowls = [];

    return {
        addBowl(bowl) {
            bowls.push(bowl);
        },

        getAllBowls() {
            return bowls;
        }, 

        getBowlsBySize(size) {
            return bowls.filter(b => b.size === size);
        },

        updateBowl(bowlId, newData) {
            bowls = bowls.map(b => {
                if (b.id === bowlId)
                    return {...b, ...newData};
                return b;
            });  
        },

        removeBowl(bowlId) {
            bowls = bowls.filter(b => b.id !== bowlId);
        },

        incrementQuantityForSize(size) {
            bowls.bowls.map(b => {
                if (b.size === size) 
                    return {...b, quantity: b.quantity + 1};
                return b;
            });
        }
    };
}

function createUserCollection() {
    let users = [];

    return {
        addUser(user) {
            users.push(user);
        },

        getAllUsers() {
            return users;
        },

        getUserById(userId) {
            return users.find(u => u.id === userId);
        },

        getUsersByRole(role) {
            return users.filter(u => u.role === role);
        },

        updateUser(userId, newData) {
            users = users.map(u => {
                if (u.id === userId)
                    return {...u, ...newData};
                return u;
            });
        },

        removeUser(userId) {
            users = users.filter(u => u.id !== userId);
        },

        addOrderToUser(userId, order) {
            users = users.map(u => {
                if (u.id === userId)
                    return {...u, pastOrders: [...u.pastOrders, order]};
                return u;
            });
        }
    };
}

function getAllBowls(db) {
    return new Promise ((resolve, reject) => {
        const sql = "SELECT * FROM bowls";

        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

function getBowlsBySize(db, size) {
    return new Promise ((resolve, reject) => {
        const sql = "SELECT * FROM bowls WHERE size = ?";

        db.all(sql, [size], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

function insertBowl(db, bowl) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO bowls (id, orderId, size, base, quantity, price) VALUES (?, ?, ?, ?, ?, ?)";

        const params = [
            bowl.id,
            bowl.orderId,
            bowl.size,
            bowl.base,
            bowl.quantity,
            bowl.price
        ];

        db.run(sql, params, function(err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}

function deleteBowlById(db, bowlId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM bowls WHERE id = ?";
        
        db.run(sql, [bowlId], function(err) {
            if (err)
                reject(err);
            else
                if (this.changes > 0) 
                    resolve();
                else
                    reject(new Error("No bowl found with the given ID."));
        });
    });
}

function updateBowlById(db, bowlId, updates) {
    return new Promise((resolve, reject) => {
        const columns = Object.keys(updates);
        const values = Object.values(updates);

        const setClause = columns.map(col => `${col} = ?`).join(", ");

        const sql = `UPDATE bowls SET ${setClause} WHERE id = ?`;

        const params = [...values, bowlId];

        db.run(sql, params, function(err) {
            if (err)
                reject(err);
            else
                if (this.changes > 0) 
                    resolve();
                else
                    reject(new Error("No bowl found with the given ID, or no changes made"));
        });
    });
}

function increasePriceForSize(db, size, increaseAmount) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE bowls SET price = price + ? WHERE size = ?";

        db.run(sql, [increaseAmount, size], function(err) {
            if (err)
                reject(err);
            else
                if (this.changes > 0)
                    resolve();
                else
                    reject(new Error("No rows updated, possibly no bowls matched the given size."));
        });
    })
}

function main() {
    const bowlCollection = createBowlCollection();

    const bowl1 = createBowl({
        id: "b1",
        size: "R",
        base: "rice",
        proteins: ["salmon"],
        ingredients: ["avocado", "kale"],
        quantity: 1,
        price: 9
    });

    const bowl2 = createBowl({
        id: "b2",
        size: "M",
        base: "black rice",
        proteins: ["chicken", "tofu"],
        ingredients: ["mango", "avocado", "peppers"],
        quantity: 2,
        price: 22
    });

    const bowl3 = createBowl({
        id: "b3",
        size: "L",
        base: "salad",
        proteins: ["tuna", "chicken", "tofu"],
        ingredients: ["corn", "tomatoes", "carrots"],
        quantity: 1,
        price: 14
    });

    const bowl4 = createBowl({
        id: "b4",
        size: "R",
        base: "salad",
        proteins: ["tofu"],
        ingredients: ["avocado", "peppers", "mango", "kale"],
        quantity: 3,
        price: 27
    });

    const bowl5 = createBowl({
        id: "b5",
        size: "M",
        base: "rice",
        proteins: ["salmon", "salmon"],
        ingredients: ["wakame", "avocado", "peppers"],
        quantity: 1,
        price: 11
    });

    bowlCollection.addBowl(bowl1);
    bowlCollection.addBowl(bowl2);
    bowlCollection.addBowl(bowl3);
    bowlCollection.addBowl(bowl4);
    bowlCollection.addBowl(bowl5);

    console.log("All bowls in Collection:", bowlCollection.getAllBowls());

    console.log("Medium Bowls:", bowlCollection.getBowlsBySize("M"));

    const userCollection = createUserCollection();

    const user1 = createUser({
        id: "u1",
        username: "initram2002",
        passwordHash: "hashed_michela",
        role: "customer",
        pastOrders: []
    });

    const user2 = createUser({
        id: "u2",
        username: "alessandro_massari",
        passwordHash: "hashed_alessandro",
        role: "admin",
        pastOrders: []
    });

    const user3 = createUser({
        id: "u3",
        username: "calogero__maria",
        passwordHash: "hashed_calogero",
        role: "customer",
        pastOrders: []
    });

    const user4 = createUser({
        id: "u4",
        username: "_lorenzo.marra",
        passwordHash: "hashed_lorenzo",
        role: "customer",
        pastOrders: []
    });

    const user5 = createUser({
        id: "u5",
        username: "_angelica_coluccia",
        passwordHash: "hashed_angelica",
        role: "admin",
        pastOrders: []
    });

    userCollection.addUser(user1);
    userCollection.addUser(user2);
    userCollection.addUser(user3);
    userCollection.addUser(user4);
    userCollection.addUser(user5);

    console.log("All Users in Collection:", userCollection.getAllUsers());

    console.log("Admin Users:", userCollection.getUsersByRole("admin"));

    const orderCollection = createOrderCollection();

    const order1 = createOrder({
        id: "o1",
        userId: "u1",
        bowls: [bowl1],
        specialRequests: "No onions, please",
        totalPrice: 9,
        discountApplied: false
    });

    const order2 = createOrder({
        id: "o2",
        userId: "u1",
        bowls: [bowl2],
        specialRequests: "Add extra sauce",
        totalPrice: 22,
        discountApplied: false
    });

    const order3 = createOrder({
        id: "o3",
        userId: "u2",
        bowls: [bowl3],
        specialRequests: "",
        totalPrice: 14,
        discountApplied: false
    });

    const order4 = createOrder({
        id: "o4",
        userId: "u3",
        bowls: [bowl1, bowl2],
        specialRequests: "Allergic to peanuts",
        totalPrice: 31,
        discountApplied: false
    });   

    const order5 = createOrder({
        id: "o5",
        userId: "u3",
        bowls: [bowl1, bowl2, bowl3],
        specialRequests: "Extra wasabi",
        totalPrice: 45,
        discountApplied: true
    });

    orderCollection.addOrder(order1);
    orderCollection.addOrder(order2);
    orderCollection.addOrder(order3);
    orderCollection.addOrder(order4);
    orderCollection.addOrder(order5);

    console.log("=== All Orders in Order Collection ===");
    console.log(orderCollection.getAllOrders());

    console.log("=== Orders by userId = 'u1' ===");
    console.log(orderCollection.getOrderByUserId("u1"));

    const db = new sqlite3.Database("database.db", (err) => {
        if (err)
            console.error("Error opening database:", err.message);
        else
            console.log("Connected to the database.db database.");
    });

    getAllBowls(db)
        .then((bowls) => {
            console.log("=== All bowls ===");
            console.log(bowls);
        })
        .catch((err) => {
            console.error("Error retrieving all bowls:", err);
        });

    getBowlsBySize(db, "R")
        .then((regularBowls) => {
            console.log("=== Regular Bowls (size = 'R') ===");
            console.log(regularBowls);
        })
        .catch((err) => {
            console.error("Error retrieving bowls by size:", err);
        });

    const newBowl = {
        id: "bXYZ",
        orderId: "o123",
        size: "M",
        base: "rice",
        quantity: 2,
        price: 22.0
    };

    insertBowl(db, newBowl)
        .then(() => {
            console.log("[SUCCESS] Bowl inserted successfully:", newBowl.id);
        })
        .catch((err) => {
            console.error("[FAILURE] Error inserting bowl:", err.message);
        });

    deleteBowlById(db, "bXYZ")
        .then(() => {
            console.log("[SUCCESS] Bowl deleted successfully: bXYZ");
        })
        .catch((err) => {
            console.error("[FAILURE] Error deleting bowl:", err.message);
        });

    updateBowlById(db, "bXYZ", {quantity: 3, price: 33.0})
        .then(() => {
            console.log("[SUCCESS] Bowl updated successfully for ID: bXYZ");
        })
        .catch((err) => {
            console.error("[FAILURE] Error updating bowl:", err.message);
        });

    increasePriceForSize(db, "M", 2.0)
        .then(() => {
            console.log("[SUCCESS] Price updated for all Medium bowls.");
        })
        .catch((err) => {
            console.error("[FAILURE] Error updating price:", err.message);
        });

    db.close((err) => {
        if (err)
            console.error("Error closing the database:", err.message);
        else
            console.log("Database connection closed.");
    });
}

main()