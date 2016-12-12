from math import sqrt
import xlwings as xw
import pandas as pd

# Change these
default_path = '/Users/lambda/Documents/Work/Bostonography/Final Project/'

base_filename = 'data_julian.csv'
base_col_x = 'B'
base_col_y = 'C'

output_column = 'I'

data_filename = 'Road_closed_event.csv'
data_col_x = 'F'
data_col_y = 'G'


# Function to compute the distance between two coordinates
def distance(coord_1,coord_2):
    x1,x2 = coord_1[0],coord_2[0]
    y1,y2 = coord_1[1],coord_2[1]
    return sqrt((x2-x1)**2+(y2-y1)**2)


# finds how many rows of data a file has
def row_count(fp):
    return len(pd.read_csv(fp)) + 1  # no idea why 1 works


# finds a name for the new column
def name_gen(fn):
    return fn.rpartition('.')[0].lower()


# Create sheet for base file (same as output)
base_filepath = default_path + base_filename
base_workbook = xw.Book(base_filepath)
base_sheet = base_workbook.sheets[0]

# Create sheet for data file (data which will be inferred from)
data_filepath = default_path + data_filename
data_workbook = xw.Book(data_filepath)
data_sheet = data_workbook.sheets[0]


# Create radius
ex1 = [42.362361,-71.058551]
ex2 = [42.361768,-71.054348]
max_dist = distance(ex1,ex2)*500/550  # distance between ex1 and ex2 is roughly 550 feet


# Get list of coordinates for base file
base_row_num = row_count(base_filepath)
base_loc_x = base_sheet.range(base_col_x + '2:' + base_col_x + str(base_row_num)).value
base_loc_y = base_sheet.range(base_col_y + '2:' + base_col_y + str(base_row_num)).value
base_coords = []
for i in range(0,len(base_loc_x)):
    base_coords.append([base_loc_x[i],base_loc_y[i]])


# Get list of coordinates for output file
data_row_num = row_count(data_filepath)
data_loc_x = data_sheet.range(data_col_x + '2:' + data_col_x + str(data_row_num - 1)).value
data_loc_y = data_sheet.range(data_col_y + '2:' + data_col_y + str(data_row_num - 1)).value
data_coords = []
for i in range(0,len(data_loc_x)):
    data_coords.append([data_loc_x[i],data_loc_y[i]])


# Write to file
row = 2  # starting row
base_sheet.range(output_column + '1').value = name_gen(data_filename) # write column title
for base_point in base_coords:
    count = 0
    for data_point in data_coords:
        if distance(base_point,data_point) <=  max_dist:
            count += 1
    base_sheet.range(output_column + str(row)).value = count
    row += 1
