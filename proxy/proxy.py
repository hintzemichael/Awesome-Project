#!/usr/bin/env python
#
import config
import cgi
import cgitb
import ftclient
import os, string, random
cgitb.enable()


'''
Code and instructions referenced:
http://fuzzytolerance.info/updating-google-fusion-table-from-a-csv-file-using-python/ 
http://code.google.com/p/fusion-tables-client-python/source/browse/trunk/src/

'''
from authorization.clientlogin import ClientLogin

#TOKEN_SIZE=6
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
columnName is either 'ups' or 'downs'; incremental update
'''
def updateVote (ft_client, table, TID, columnName):
	#check if the row exists. if it does, then UPDATE; otherwise INSERT
	query= "SELECT ROWID, TID, ups, downs FROM %s where TID='%s';" % (table, TID)
	#print query
	q=ft_client.query(query)
	d=makeDict(q)
	print d
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
		#print str(int(d[columnName][0])+1)
		query= "UPDATE %s SET %s='%s' where ROWID='%s';" % (table, columnName, str(int(d[columnName][0])+1), d['rowid'][0])
		q=ft_client.query(query)
	return q


'''
verifies if a token is correct from the people table 
'''
def verifyToken (ft_client, table, PID, token):
	query= "SELECT ROWID, PID, token FROM %s  AS t where PID='%s';" % (table, PID)
	q=ft_client.query(query)
	d=makeDict(q)
	if (len(d['PID'])==0) :
		#no record found
		return False
	else:
		actualToken=d['token'][0]
		if (actualToken==token):
			return True
		else:
			return False

'''
http://stackoverflow.com/questions/2257441/python-random-string-generation-with-upper-case-letters-and-digits
'''
def generateToken(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))

print "Content-type:text/plain\r\n\r\n"


token = ClientLogin().authorize(config.USERNAME, config.PASSWORD)
ft_client = ftclient.ClientLoginFTClient(token)

postData=cgi.FieldStorage()
action = postData.getvalue('action')

if action== "update_vote":
		TID = postData.getvalue('TID')
		columnName=postData.getvalue('columnName')
		updateVote(ft_client, config.VOTES, TID, columnName)

elif action == "verify_token":
		PID = postData.getvalue('PID')
		in_token=postData.getvalue('token')
		print verifyToken(ft_client, config.PEOPLE, PID, in_token) # True or False



#query= 'SELECT ROWID, TID, ups, downs FROM '+config.VOTES+" AS t where TID=2;"
#print query
#q=ft_client.query(query)

#print updateVote(ft_client, config.VOTES, 6, 'ups')
#print verifyToken(ft_client, config.PEOPLE, 0, 'q1w2e3')
#print generateToken()




#votes=makeDict(q)
#print votes

#v= getVote(votes, 0)
#print (v)

#updateVote(ft_client, config.VOTES, 'TID', '1', 'ups', '8')

#print findNextID(votes,'TID')