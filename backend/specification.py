import csv
import random

# Define sizes
sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

# Open CSV file for writing
with open('products.csv', mode='w', newline='') as file:
    writer = csv.writer(file)

    # Write header
    writer.writerow(['pro_id', 'quantity', 'size'])

    # Generate data
    for pro_id in range(1, 31):
        for size in sizes:
            quantity = random.randint(0, 50)
            writer.writerow([pro_id, quantity, size])

print("CSV file 'products.csv' generated successfully!")
