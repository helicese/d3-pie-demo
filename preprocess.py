import datetime
import itertools
import operator
import time

csvfile = open('lxy.csv','r')
records = []

for line in csvfile:
	records.append(line.split(', ')[:-1])

csvfile.close()
records = records[2:]

catagory = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Z']

borrow_dates = {}
catagory_dict = {c:[] for c in catagory}
book_cata = {}
book_interval = {}
rec_borrow = {}
rec_return = {}

a = 0
for rec in records:
	if rec[-2][0] =='R': # if start with Recalled##
		rec[-2] = rec[-2][-8:]
	if rec[-1][0] =='R':
		rec[-1] = rec[-1][-8:]

	expected_return_time = datetime.datetime.strptime(rec[-2], '%Y%m%d')
	return_time = datetime.datetime.strptime(rec[-1], '%Y%m%d')

	
	# print datetime.timedelta(days=40)


	interval = (return_time - (expected_return_time - datetime.timedelta(days=60))).days
	while interval < 0:
		interval += 40
	rec.append(interval) # store time interval

	rec[5] = rec[5][0] # get catagory
	
	catagory_dict[rec[5]].append(rec[0]) # books added to their catagory

	if rec[-2] in borrow_dates:
		borrow_dates[rec[-2]].append(rec[0])
	else:
		borrow_dates[rec[-2]] = [rec[0]]

	book_cata[rec[0]] = rec[5]
	book_interval[rec[0]] = interval

	rec_borrow[rec[0]] = (expected_return_time - datetime.timedelta(days=60)).strftime('%Y%m%d')
	rec_return[rec[0]] = rec[7]
	print rec_borrow[rec[0]]
	# print catagory_dict['A']
# print len(borrow_dates)
# print borrow_dates

# print borrow_dates

links_file = open('links.js','w')
links_file.write('var book_links = [\n')

i = 0
for k, v in borrow_dates.iteritems():
	perms = list(itertools.combinations(v, 2))
	if len(perms)>0:
		for source, target in perms:
			if i != 0:
				links_file.write(',\n')
			links_file.write('{source:"' +source + '", target: "' + target +'", srccata:"'+  book_cata[source] + '", dstcata:"' + book_cata[target]  +  '" }')
			i += 1

links_file.write('\n];\n')
links_file.close()

nodes_file = open('nodes2.js','w')
nodes_file.write('var book_nodes = {\n name:"",\n children:[')

cata_num = {k:len(v) for k, v in catagory_dict.iteritems()}

sorted_cata = reversed(sorted(cata_num.items(), key=operator.itemgetter(1)))

i = 0
for k, v in  sorted_cata:

	temp_dict = {}
	for n in catagory_dict[k]:

		temp_dict[n] = book_interval[n]

	sorted_temp = reversed(sorted(temp_dict.items(), key=operator.itemgetter(1)))

	for n, day in sorted_temp:

		borrow_ = rec_borrow[n]
		return_ = rec_return[n] 

		if i != 0:
			nodes_file.write(',\n')
		nodes_file.write('{name:"' + n + '", catagory:"' + k + '", interval:"' + str(day) +  '", borrow_date:"' + str(borrow_) + '", return_date:"' + str(return_)   +  '"}')	
		i += 1

nodes_file.write('\n]\n};')
