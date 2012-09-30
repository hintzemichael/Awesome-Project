#!/usr/bin/env python
#
import config
import cgi
import cgitb
import ftclient
import os
cgitb.enable()


'''
Code and instructions referenced:
http://fuzzytolerance.info/updating-google-fusion-table-from-a-csv-file-using-python/ 
http://code.google.com/p/fusion-tables-client-python/source/browse/trunk/src/

'''
from authorization.clientlogin import ClientLogin

'''
returns a dictionary when given a CSV-like string
{'TID': ['0', '1', ''], 'Date': ['0', '1', ''], 'downs': ['0', '1', ''], 'ups': ['0', '1', '']}
'''
def makeDict (string):
	rows=string.split('\n')
	columns=rows[0].split(',')
	d={}
	for c in columns:
		d[c]=[]
	for row in rows[1:]:
		if (row.strip()==''):
			break
		spl=row.split(',')
		i=0
		for c in columns:
			d[c].append(spl[i])
			i+=1
	return d


'''
give either a string '1' or int 1
returns a dict {'ups': int, 'downs': int}
-1 -1 if not found
'''
def getVote (votesDict, TID):
	d = {'ups': -1, 'downs': -1}

	try:
		#cast to string first
		if type(TID) is int:
			TID = str(TID)
		index=votesDict['TID'].index(TID)
		print (index)
		d['ups']=votesDict['ups'][index]
		print votesDict['ups'][index]
		d['downs']=votesDict['downs'][index]
		print votesDict['downs'][index]
		return d
	except:
		#TID not found
		return d

'''
assumes columnName is correct in the given dict
'''
def findNextID (dict, columnName):
	column=[]
	for c in dict[columnName]:
		if (c.strip()!=''):
			column.append(int(c))

	return max(column)+1

'''
columnName is either 'ups' or 'downs'
'''
def updateVote (ft_client, table, TID, columnName, value):
	#check if the row exists. if it does, then UPDATE; otherwise INSERT
	query= "SELECT ROWID, TID, ups, downs FROM %s  AS t where TID='%s';" % (table, TID)
	#print query
	q=ft_client.query(query)
	d=makeDict(q)
	if (len(d['TID'])==0):
		#INSERT
		ups=0
		downs=0
		if columnName=='ups':
			ups=value
		else:
			downs=value
		query = "INSERT INTO %s (TID, ups, downs) VALUES (%s, %s, %s);" % (table, TID, ups, downs)
		q=ft_client.query(query)
	else:
		#UPDATE
		query= "UPDATE %s SET %s='%s' where ROWID='%s';" % (table, columnName, value, d['rowid'][0])
		q=ft_client.query(query)
	return q


token = ClientLogin().authorize(config.USERNAME, config.PASSWORD)
ft_client = ftclient.ClientLoginFTClient(token)

postData=cgi.FieldStorage()
tableName = postData.getvalue('tableName')


#query= 'SELECT ROWID, TID, ups, downs FROM '+config.VOTES+" AS t where TID=2;"
#print query
#q=ft_client.query(query)

print updateVote(ft_client, config.VOTES, 6, 'downs', 2)
#votes=makeDict(q)
#print votes

#v= getVote(votes, 0)
#print (v)

#updateVote(ft_client, config.VOTES, 'TID', '1', 'ups', '8')

#print findNextID(votes,'TID')