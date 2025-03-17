CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    specialRequests TEXT,
    totalPrice REAL DEFAULT 0,
    discountApplied INTEGER DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bowls (
    id TEXT PRIMARY KEY,
    orderId TEXT NOT NULL,
    size TEXT NOT NULL,
    base TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    price REAL DEFAULT 0,
    FOREIGN KEY(orderId) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS bowl_proteins (
    bowlId TEXT NOT NULL,
    protein TEXT NOT NULL,
    FOREIGN KEY(bowlId) REFERENCES bowls(id)
);

CREATE TABLE IF NOT EXISTS bowl_ingredients (
    bowlId TEXT NOT NULL,
    ingredient TEXT NOT NULL,
    FOREIGN KEY(bowlId) REFERENCES bowls(id)
);

CREATE TABLE IF NOT EXISTS daily_availability (
    id TEXT PRIMARY KEY,
    maxR INTEGER DEFAULT 10,
    maxM INTEGER DEFAULT 8,
    maxL INTEGER DEFAULT 6,
    priceR INTEGER DEFAULT 9,
    priceM INTEGER DEFAULT 11,
    priceL INTEGER DEFAULT 14
);

INSERT INTO users (id, username, passwordHash, role)
VALUES
    ('u1', 'michela', 'hashed_michela', 'customer'),
    ('u2', 'alessandro', 'hashed_alessandro', 'admin'),
    ('u3', 'calogero', 'hashed_calogero', 'customer'),
    ('u4', 'lorenzo', 'hashed_lorenzo', 'customer'),
    ('u5', 'angelica', 'hashed_angelica', 'admin');

INSERT INTO orders (id, userId, specialRequests, totalPrice, discountApplied)
VALUES
    ('o1', 'u1', 'No peppers please', 18.0, 0),
    ('o2', 'u1', 'Extra spicy sauce', 30.0, 1),
    ('o3', 'u3', 'Allergic to mango', 9.0, 0),
    ('o4', 'u4', null, 14.0, 0),
    ('o5', 'u5', 'No onions', 0.0, 0);

INSERT INTO bowls (id, orderId, size, base, quantity, price)
VALUES
    ('b1', 'o1', 'R', 'rice', 1, 9.0),
    ('b2', 'o1', 'M', 'black rice', 1, 11.0),
    ('b3', 'o2', 'M', 'salad', 2, 22.0),
    ('b4', 'o3', 'R', 'salad', 1, 9.0),
    ('b5', 'o4', 'L', 'salad', 1, 14.0);

INSERT INTO bowl_proteins (bowlId, protein) 
VALUES
    ('b1', 'salmon');

INSERT INTO bowl_ingredients (bowlId, ingredient)
VALUES
    ('b1', 'avocado'),
    ('b1', 'kale');

INSERT INTO bowl_proteins (bowlId, protein) 
VALUES
    ('b2', 'chicken'),
    ('b2', 'tofu');

INSERT INTO bowl_ingredients (bowlId, ingredient) 
VALUES
    ('b2', 'mango'),
    ('b2', 'avocado'),
    ('b2', 'peppers');

INSERT INTO bowl_proteins (bowlId, protein)
VALUES
    ('b3', 'salmon'),
    ('b3', 'tofu');

INSERT INTO bowl_ingredients (bowlId, ingredient)
VALUES
    ('b3', 'tomatoes'),
    ('b3', 'peppers');

INSERT INTO bowl_proteins (bowlId, protein)
VALUES 
    ('b4', 'chicken');

INSERT INTO bowl_ingredients (bowlId, ingredient)
VALUES
    ('b4', 'avocado');

INSERT INTO bowl_proteins (bowlId, protein)
VALUES
    ('b5', 'tuna'),
    ('b5', 'chicken'),
    ('b5', 'tofu');

INSERT INTO bowl_ingredients (bowlId, ingredient)
VALUES
    ('b5', 'mango'),
    ('b5', 'corn');

INSERT INTO daily_availability (id, maxR, maxM, maxL, priceR, priceM, priceL)
VALUES
    ('day1', 10, 8, 6, 9, 11, 14);