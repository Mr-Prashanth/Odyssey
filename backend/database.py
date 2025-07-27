import mysql.connector as sql

class Database:

    def __init__(self, host = None, user = None, passwrd = None, db = NotImplemented):

        self._mydb = sql.connect(host = "localhost", user="root", passwd="Prashanth_2005", db = "odyssey")
        self._cur = self._mydb.cursor()

    def isNone(value):
        if len(value) == 0:
            return True
        return False
    def connection(self):
        if not self._mydb.is_connected():
            self._mydb.reconnect()
            self._cur = self._mydb.cursor()
            return
     
    def get_user(self, phone):
        self.connection()
        self._cur.execute("select user_id , name, phone L,dob, street, area, city, pincode, password from user_data where phone = %s", (phone,))
        user = self._cur.fetchall()
        if Database.isNone(user):
            return False
        col_name = ['user_id' , 'name', 'phone' ,'dob', 'street', 'area', 'city', 'pincode', 'password']
        result = {}
        for i, j in zip(col_name,user[0]):
            result[i] = j
        return result
    
    def add_user(self, phone, password):
        self.connection()
        if self.get_user(phone):
            return False
        self._cur.execute("insert into user_data(phone, password) value(%s, %s)", (phone, password))
        self._mydb.commit()
        self._cur.execute("SELECT LAST_INSERT_ID();")
        user_id = self._cur.fetchall()[0][0]
        return user_id
    
    def add_user_profile(self, user_id, name, dob, street, area, city, pincode):
        self.connection()
        self._cur.execute("update user_data set name = %s, dob = %s, street = %s, area = %s, city = %s, pincode = %s where user_id = %s", (name, dob, street, area, city, pincode, user_id))
        self._mydb.commit()
        return True

    def search(self, key):
        self.connection()
        self._cur.execute("SELECT pro_id, pro_name, pro_description, category, fit, material, sex, price, rating, total_rating, image_link FROM product_data WHERE pro_name LIKE CONCAT('%', %s, '%')", (key,))
        product = self._cur.fetchall()
        if Database.isNone(product):
            return False
        col_name = ['pro_id', 'pro_name', 'pro_description', 'category', 'fit', 'material', 'sex', 'price', 'rating', 'total_rating', 'image_link']
        result = []
        for i in product:
            dic = {}
            for j, k in zip(col_name,i):
                dic[j] = k
            result.append(dic)
        return result
    
    def get_product(self, pro_id):
        self.connection()
        self._cur.execute("SELECT pro_id, pro_name, pro_description, category, fit, material, sex, price, rating, total_rating, image_link FROM product_data WHERE pro_id = %s", (pro_id,))
        product = self._cur.fetchall()
        if Database.isNone(product):
            return False
        col_name = ['pro_id', 'pro_name', 'pro_description', 'category', 'fit', 'material', 'sex', 'price', 'rating', 'total_rating', 'image_link']
        result = []
        for i in product:
            dic = {}
            for j, k in zip(col_name,i):
                dic[j] = k
            result.append(dic)
        return result[0]

    def get_product_specification(self, pro_id):
        self.connection()
        self._cur.execute("select * from specification_data where pro_id = %s", (pro_id,))
        col_name = ['spec_id', 'pro_id', 'quantity', 'size']
        result = []
        spec = self._cur.fetchall()
        if Database.isNone(spec):
            return False
        for i in spec:
            dic = {}
            for j, k in zip(col_name,i):
                dic[j] = k
            result.append(dic)
        return result
    
    def add_cart(self, user_id, pro_id, spec_id, quantity, price):
        self.connection()
        self._cur.execute("insert into cart_data(user_id, pro_id, spec_id, quantity, price) value(%s, %s, %s, %s, %s)", (user_id, pro_id, spec_id, quantity, price))
        self._mydb.commit()
        return True
    
    def get_cart(self, user_id):
        self._cur.execute("SELECT cd.cart_id, cd.pro_id, pd.pro_name, pd.price, cd.quantity AS quantity_in_cart, sd.size, pd.image_link FROM cart_data cd JOIN product_data pd ON cd.pro_id = pd.pro_id JOIN specification_data sd ON cd.spec_id = sd.spec_id WHERE cd.user_id = %s;", (user_id,))
        col_name = ['cart_id', 'pro_id', 'pro_name', 'price', 'quantity' , 'size', 'image_link']
        result = []
        for i in self._cur.fetchall():
            dic = {}
            for j, k in zip(col_name, i):
                dic[j] = k
            result.append(dic)
        return result

    def clear_cart(self, user_id):
        self.connection()
        self._cur.execute("DELETE FROM cart_data WHERE user_id = %s", (user_id,))
        self._mydb.commit()
        return True

    def place_order(self, user_id, mode):
        # Step 1: Get all cart items
        query = "SELECT pro_id, spec_id, quantity, price FROM cart_data WHERE user_id = %s"
        self._cur.execute(query, (user_id,))
        cart_items = self._cur.fetchall()

        if not cart_items:
            return False  # Empty cart

        # Step 2: Calculate total amount
        total_amt = sum(item[2] * item[3] for item in cart_items)

        # Step 3: Payment status
        payment_status = "not payed" if mode == "cash on delivery" else "payed"

        # Step 4: Insert into order_data
        query = """
            INSERT INTO order_data(user_id, date_of_order, total_amt, mode, payment_status) 
            VALUES(%s, CURDATE(), %s, %s, %s)
        """
        self._cur.execute(query, (user_id, total_amt, mode, payment_status))
        order_no = self._cur.lastrowid

        # Step 5: Add products to order_contain_product & Reduce stock
        for pro_id, spec_id, quantity, price in cart_items:
            
            # Insert into order_contain_product
            query = """
                INSERT INTO order_contain_product(order_no, pro_id, spec_id, quantity, price) 
                VALUES(%s, %s, %s, %s, %s)
            """
            self._cur.execute(query, (order_no, pro_id, spec_id, quantity, price))
            
            # Update stock
            query = """
                UPDATE specification_data 
                SET quantity = quantity - %s 
                WHERE spec_id = %s AND quantity >= %s
            """
            self._cur.execute(query, (quantity, spec_id, quantity))

        # Step 6: Clear user's cart
        query = "DELETE FROM cart_data WHERE user_id = %s"
        self._cur.execute(query, (user_id,))

        self._mydb.commit()
        return order_no, total_amt
    
    def view_orders(self, user_id):
        query = "SELECT order_no, total_amt, mode, payment_status FROM order_data WHERE user_id = %s"
        self._cur.execute(query, (user_id,))
        orders = self._cur.fetchall()

        result = []

        for order in orders:
            order_no = order[0]

            product_query = """
                SELECT p.pro_id, p.pro_name, op.price, op.quantity
                FROM order_contain_product op
                JOIN product_data p ON op.pro_id = p.pro_id
                WHERE op.order_no = %s
            """
            self._cur.execute(product_query, (order_no,))
            products_data = self._cur.fetchall()

            products = [
                {
                    "pro_id": p[0],
                    "pro_name": p[1],
                    "price": p[2],
                    "qty": p[3]
                }
                for p in products_data
            ]

            result.append({
                "order_no": order_no,
                "amount": order[1],               # total_amt
                "payment_mode": order[2],         # mode
                "status": order[3],               # payment_status
                "products": products
            })

        return result
    
    def get_top_category_products(self):
        # Fetch top 6 categories based on avg(rating * total_rating)
        query = """
            SELECT category, AVG(rating * total_rating) as score 
            FROM product_data
            GROUP BY category
            ORDER BY score DESC
            LIMIT 5
        """
        self._cur.execute(query)
        top_categories = self._cur.fetchall()

        result = []

        for category in top_categories:
            # Fetch top product from that category based on rating * total_rating
            product_query = """
                SELECT pro_id, pro_name, price, rating, image_link
                FROM product_data
                WHERE category = %s
                ORDER BY (rating * total_rating) DESC
                LIMIT 1
            """
            self._cur.execute(product_query, (category[0],))
            product = self._cur.fetchone()

            if product:
                result.append({
                    "category": category[0],
                    "product": {
                        "pro_id": product[0],
                        "pro_name": product[1],
                        "price": product[2],
                        "rating": product[3],
                        "image_link": product[4]
                    }
                })

        return result
    
    def get_trending_products(self):
        query = """
            SELECT pro_id, pro_name, price, rating, image_link
            FROM product_data
            ORDER BY (rating * total_rating) DESC
            LIMIT 5
        """
        self._cur.execute(query)
        products = self._cur.fetchall()

        result = []

        for product in products:
            result.append({
                "pro_id": product[0],
                "pro_name": product[1],
                "price": product[2],
                "rating": product[3],
                "image_link": product[4]
            })

        return result
    def add_product_with_specifications(self, pro_name, pro_description, fit, category, material, sex, price, rating, total_rating, image_link, specs):
        """
        specs -> list of dict like:
        [
            {"size": "S", "quantity": 10},
            {"size": "M", "quantity": 15},
            {"size": "L", "quantity": 5}
        ]
        """

        self.connection()

        # Add product to product_data
        product_query = """
            INSERT INTO product_data 
            (pro_name, pro_description, fit, category, material, sex, price, rating, total_rating, image_link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        product_values = (pro_name, pro_description, fit, category, material, sex, price, rating, total_rating, image_link)

        self._cur.execute(product_query, product_values)
        self._mydb.commit()

        # Get new product id
        self._cur.execute("SELECT LAST_INSERT_ID()")
        pro_id = self._cur.fetchone()[0]

        # Add each specification for this product
        spec_query = "INSERT INTO specification_data (pro_id, quantity, size) VALUES (%s, %s, %s)"

        for spec in specs:
            size = spec["size"]
            quantity = spec["quantity"]
            self._cur.execute(spec_query, (pro_id, quantity, size))

        self._mydb.commit()

        return pro_id

    def add_rating(self, pro_id, new_rating):
        self.connection()
        # check if product exists
        self._cur.execute("SELECT rating, total_rating FROM product_data WHERE pro_id = %s", (pro_id,))
        data = self._cur.fetchone()

        if not data:
            return False  # product not found

        current_rating, total_rating = data

        # calculate new average rating
        updated_total_rating = total_rating + 1
        updated_rating = ((current_rating * total_rating) + new_rating) / updated_total_rating

        # update in database
        self._cur.execute('''
            UPDATE product_data
            SET rating = %s, total_rating = %s
            WHERE pro_id = %s
        ''', (updated_rating, updated_total_rating, pro_id))

        self._mydb.commit()
        return True





