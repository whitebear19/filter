
import os
import re
import csv
import sys
import json
import time
from timeloop import Timeloop
from datetime import timedelta
import shutil
import requests
import mysql.connector
from zipfile import ZipFile
from datetime import date
from pathlib import Path
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver import ActionChains 
from selenium.common.exceptions import NoSuchElementException
path = os.path.dirname(os.path.abspath(__file__))
src = 'https://www.guatecompras.gt/concursos/consultaConcursos.aspx?o=1&d=1'
option = webdriver.ChromeOptions()
option.add_argument("--window-size=900,700")
driver = webdriver.Chrome(path+"/chromedriver",options = option)

class makeTuple :
    ''' this class is for making tuple for creating a table and inserting data to a table. '''
    def __init__(self,lst):
        self.lst = lst
    def header(self):
        defineHeader = " (id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,"
        for i in range(len(self.lst)):
            if i == len(self.lst)-1:
                defineHeader += ' {hd} {attrs}'.format(hd=self.lst[i],attrs='TEXT CHARACTER SET utf8 COLLATE utf8_general_ci')
            else: 
                defineHeader += ' {hd} {attrs},'.format(hd=self.lst[i],attrs='TEXT CHARACTER SET utf8 COLLATE utf8_general_ci')
        resultHeader = '{})'.format(defineHeader)        
        return resultHeader
    def insert(self):
        fieldTup = str(self.lst).replace('[','(').replace(']',')')
        num = '('
        for i in range(len(self.lst)):
            if i == len(self.lst)-1:
                num +='%s'
            else:
                num +='%s,'
        resultnum = '{})'.format(num)
        resultinsert = ' {f} VALUES {n}'.format(f=fieldTup,n=resultnum)        
        return resultinsert            

class buildDB:
    ''' for building table in database '''
    def __init__(self,user,pw,database):
        self.user = user
        self.pw = pw
        self.database = database
    def display(self):
        print('user : ',self.user)
        print('database : ',self.database)
    def databaseConnect(self):
        try:
            connect = mysql.connector.connect(host = 'localhost', user = self.user, passwd = self.pw, database = self.database)
            cursor = connect.cursor()
        except Exception as er:
            print('disconnect database : ',er)
            return False
        return connect, cursor 
    def createTable(self,tablename,headTuple):
        connect, cursor = self.databaseConnect()        
        cursor.execute("CREATE TABLE "+tablename+str(headTuple))    
    def insertTable(self,tablename,insertTuple,valTuple):
        connect, cursor = self.databaseConnect() 
        query = "INSERT INTO "+tablename+str(insertTuple).replace("'","")
        val = valTuple       
        cursor.execute(query, val)
        connect.commit()
    def compareDuplicate(self,tablename,field,val):
        connect, cursor = self.databaseConnect()
        comparesql = "SELECT * FROM {tn} WHERE {f}='{v}'".format(tn=tablename,f=field,v=val)
        cursor.execute(comparesql)
        compareresult = cursor.fetchall()
        # print(compareresult)
        if compareresult :                       
            flag = False
        else :
            flag =True
        return flag 


def _getSql(lst):
    headerlst5 = ['a','b','c','d','e','h','i','j','k','m']
    username = 'root'
    password = ''
    DBname = 'dupmnvmy_datascraping'
    tablename = 'currents'
    headTuple = makeTuple(headerlst5).header()
    insertTuple = makeTuple(headerlst5).insert()
    obj = buildDB(username,password,DBname)
    for i in range(len(lst)):        
        val = lst[i][0],lst[i][1],lst[i][2],lst[i][3],lst[i][4],lst[i][5],lst[i][6],lst[i][7],lst[i][8],lst[i][9]
        try:
            obj.createTable(tablename,headTuple)
        except Exception as er :
            pass       
        if obj.compareDuplicate(tablename,headerlst5[0],val[0]) == True:
            obj.insertTable(tablename,insertTuple,val)

def _readCsv(filename):
    with open(filename+".csv",encoding="cp437", errors='ignore') as fp:
        reader = csv.reader(fp, delimiter=",", quotechar='"')          
        lst_src = [row for row in reader]
    return lst_src
def _writeCsv(name,lst):    
    csvName = name
    with open(csvName+'.csv', 'w',newline='',encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile)        
        csvwriter.writerows(lst)  
def _convertDate(inputDate):
    monthlst = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
    d = inputDate[0:2]
    m = inputDate[3:6]
    if m in monthlst:
        if 'nov' == m or 'dic' == m or 'oct' == m :
            mm = str(monthlst.index(m)+1)            
        else:
            mm = '0'+str(monthlst.index(m)+1)        
    y = inputDate[8:len(inputDate)]
    deadline = "{year}-{month}-{date1}".format(year = y, month = mm, date1 = d)
    compaDate = "{year}{month}{date1}".format(year = y, month = mm, date1 = d)     
    return compaDate
def _getRows(page):
    aa,bb,cc,dd,ee,hh,ii,jj,kk,mm = '','','','','','','','','',''
    modallst = ['Adquisición Directa por Ausencia de Oferta (Art. 32 LCE)',
        'Adquisiciones con proveedor único (Art.43 inciso c)',
        'Arrendamiento o Adquisición de Bienes Inmuebles (Art.43 inciso e)',
        'Arrendamientos por Cotización(Art.43 inciso d )',
        'Arrendamientos por Licitación Pública(Art.43 inciso d )',
        'Bienes y Suministros Importados (Art. 5 LCE)',
        'Compra de Baja Cuantía (Art.43 inciso a)',
        'Compra Directa con Oferta Electrónica (Art. 43 LCE Inciso b)',
        'Compra Directa con Oferta Electrónica Ley de Emergencia COVID19',
        'Contrato Abierto (Art. 46 LCE)',
        'Convenios y Tratados Internacionales (Art. 1 LCE)',
        'Cotización (Art. 38 LCE)',
        'Donaciones (Art. 1 LCE)',
        'Dragados (Art.43 inciso f)',
        'Licitación de proyectos APP (Artículo 40 Decreto 16-2010)',
        'Licitación Pública (Art. 17 LCE)',
        'Negociaciones entre Entidades Públicas (Art. 2 LCE)',
        'Precalificación de Proyectos APP (Art. 60 Decreto 16-2010)',
        'Procedimiento Regulado por el Art. 54Bis (Subasta Electrónica Inversa)',
        'Procedimiento Regulado por el Art. 54Bis (Subasta Electrónica Inversa)',
        'Procedimiento Regulado por el Artículo 54 Bis (Fase de Precalificación)',
        'Procedimientos Regulados por el Art. 95 LCE (Concesiones)',
        'Procedimientos Regulados por el artículo 44 LCE (Casos de Excepción)',
        'Procedimientos regulados por el artículo 54 LCE',
        'Subasta Pública (Art. 89 LCE)',
        'Vinculaciones Acuerdo Ministerial 65-2011 A'
        ]
    categlst = ['Alimentos y semillas',
        'Computación y telecomunicaciones',
        'Construcción y materiales afines',
        'Electricidad y aire acondicionado',
        'Limpieza, fumigación y artículos afines',
        'Muebles y mobiliario de oficina',
        'Papelería y artículos de librería',
        'Publicidad, campañas y vallas',
        'Salud e insumos hospitalarios',
        'Seguridad y armamento',
        'Seguros, fianzas y servicios bancarios',
        'Textiles, ropa y calzado',
        'Transporte, repuestos y combustibles',
        'Otros tipos de bienes o servicios'
        ]
    alst = []
    baseurl = 'https://www.guatecompras.gt{suburl}'
    soup = BeautifulSoup(page,'html.parser')
    trs = soup.find_all('tr')
    # print('--total count of "Listado de Concurso"{trs}'.format(trs=len(trs)))
    for i in range(len(trs)):
        lst = ['','','','','','','','','','']        
        if trs[i].get('class')[0] == 'FilaTablaDetalle' or \
            trs[i].get('class')[0] == 'FilaTablaDetallef' :            
            tds = trs[i].find_all('td')
            for j in range(len(tds)):
                if j < 2:                    
                    labels = tds[j].find_all('label')                                       
                    if len(labels) == 6:                
                        aa = labels[0].get_text().strip()
                        bb = labels[1].get_text().strip()
                        cc = labels[2].get_text().strip()
                        dd = labels[4].get_text().strip()
                        ee = labels[5].get_text().strip()
                    elif len(labels) == 3:
                        hh = labels[0].get_text().strip()
                        ii = labels[1].get_text().strip()
                        jjS = labels[2].get_text().strip()
                        value = ''
                        if '|' in jjS :                            
                            for sp in range(len(jjS.split('|'))):
                                val = jjS.split('|')[sp].strip()
                                if val in categlst :
                                    value += ' '+'cate'+str(categlst.index(val))
                        else:
                            if jjS in categlst :
                                value = 'cate{}'.format(categlst.index(jjS))
                        jj = value
                        kk = tds[j].find('a').get_text().strip()+'||'+baseurl.format(suburl=tds[j].find('a').get('href'))                        
                elif j == 2:
                    mmS = tds[j].get_text().strip()
                    if mmS in modallst:
                        mm = 'modal{}'.format(str(modallst.index(mmS)))
                    else:
                        mm = ''
            lst[0],lst[1],lst[2],lst[3],lst[4] = aa,bb,cc,dd,ee
            lst[5],lst[6],lst[7],lst[8],lst[9] = hh,ii,jj,kk,mm            
            alst.append(lst)
            # print('----',i,lst[0]) 
    if len(alst) > 10:
        print('check _getRows, count, 10th lst:',len(alst))
    return alst  
''' _getListQuery is function for creating Mysql 
    _getList is function for creating csv '''
def _getListQuery(url):
        
    jumpF = False 
    driver.get(url)
    time.sleep(2) 
    #--- get all page count --
    table1 = driver.find_element_by_class_name('Tabla1')
    con = table1.text
    trows = re.findall(r'\d+',con)[-1]
    lastpageNum = int(int(trows)/50)+1
    print('check lastpageNum:',lastpageNum)
    footer = driver.find_element_by_class_name('lnk-footer')
    actions = ActionChains(driver)
    actions.move_to_element(footer).perform()        
    time.sleep(1)
    # -- read nog.txt --
    compare = ''
    if os.path.exists('nog.txt'):
        f1=open('nog.txt','r')
        compare = f1.read()
    ''' set page count with lastpageNum '''
    for i in range(lastpageNum): # lastpageNum
        if jumpF == True:
            break         
        gridTable2 = driver.find_element_by_class_name('table.Tabla1')
        rowslst = _getRows(gridTable2.get_attribute('innerHTML'))
        if i == 0:
            f2=open('nog.txt','w')
            f2.write(rowslst[0][0])
        _getSql(rowslst)
        if compare != '' :
            for k in range(len(rowslst)):                       
                if rowslst[k][0] == compare:
                    print('fetchone : ',compare)
                    jumpF = True
                    break
        # --- click pagenation button --        
        try:
            driver.find_element_by_class_name('TablaPagineo')
        except Exception as err:
            print('invisible TablaPagineo:',err)
            time.sleep(5)
            gridTable2 = driver.find_element_by_class_name('table.Tabla1')
        pagetr2 = driver.find_element_by_class_name('TablaPagineo')         
        pagebuttons = pagetr2.find_elements_by_tag_name('a')
        for b in range(len(pagebuttons)):
            if pagebuttons[b].text == str(i+2) or \
                pagebuttons[b].text == '...' and b > 1:           
                print('-check button:',pagebuttons[b].text)                                                
                pagebuttons[b].click()
                pagetr2 = driver.find_element_by_class_name('TablaPagineo')
                span2 = pagetr2.find_elements_by_tag_name('span')[-1]                
                for r in range(20):
                    try:
                        lamb = span2.text
                    except Exception as er:                        
                        time.sleep(3)
                        break
                    time.sleep(1)                    
                break
    # driver.close()
def _getList(url):
    jumpF = False    
    totallst = [['a','b','c','d','e','h','i','j','k','m']]
    deadlst = [['a','b','c','d','e','h','i','j','k','m']]
    compalst, compalst2 = [[],['0000']], [[],['0000']]   
    driver.get(url)
    time.sleep(2) 
    #--- get all page count --
    table1 = driver.find_element_by_class_name('Tabla1')
    con = table1.text
    trows = re.findall(r'\d+',con)[-1]
    lastpageNum = int(int(trows)/50)+1
    print('check lastpageNum:',lastpageNum)
    footer = driver.find_element_by_class_name('lnk-footer')
    actions = ActionChains(driver)
    actions.move_to_element(footer).perform()        
    time.sleep(1)
    #-- compare consulta.csv file with lst --
    if os.path.exists(path+'/current.csv'):
        compalst = _readCsv(path+'/current')
        compalst.remove(compalst[0])
    if os.path.exists(path+'/deadline.csv'):
        compalst2 = _readCsv(path+'/deadline')
        compalst2.remove(compalst2[0])
    ''' set page count with lastpageNum '''
    for i in range(lastpageNum): # lastpageNum
        if jumpF == True:
            break         
        gridTable2 = driver.find_element_by_class_name('table.Tabla1')
        rowslst = _getRows(gridTable2.get_attribute('innerHTML'))
        for k in range(len(rowslst)):            
            if rowslst[k][0] == compalst[1][0]:
                jumpF = True
                break
            elif not rowslst[k] in totallst :
                #-- seperating old data and new data with deadline --
                today = str(date.today()).replace('-','')
                deaddate = _convertDate(rowslst[k][2]) 
                if int(deaddate) >= int(today) :
                    totallst.append(rowslst[k])
                else:
                    deadlst.append(rowslst[k])
        if len(compalst) > 2:                   
            _writeCsv('current',totallst+compalst) 
        elif len(compalst) <= 2:            
            _writeCsv('current',totallst)
        if len(compalst2) > 2:                   
            _writeCsv('deadline',deadlst+compalst2) 
        elif len(compalst2) <= 2:            
            _writeCsv('deadline',deadlst)
        # --- click pagenation button --        
        try:
            driver.find_element_by_class_name('TablaPagineo')
        except Exception as err:
            print('invisible TablaPagineo:',err)
            time.sleep(5)
            gridTable2 = driver.find_element_by_class_name('table.Tabla1')
        pagetr2 = driver.find_element_by_class_name('TablaPagineo')         
        pagebuttons = pagetr2.find_elements_by_tag_name('a')
        for b in range(len(pagebuttons)):
            if pagebuttons[b].text == str(i+2) or \
                pagebuttons[b].text == '...' and b > 1:           
                print('-check button:',pagebuttons[b].text)                                                
                pagebuttons[b].click()
                pagetr2 = driver.find_element_by_class_name('TablaPagineo')
                span2 = pagetr2.find_elements_by_tag_name('span')[-1]                
                for r in range(20):
                    try:
                        lamb = span2.text
                    except Exception as er:                        
                        time.sleep(3)
                        break
                    time.sleep(1)                    
                break
    # driver.close()


tl = Timeloop()
@tl.job(interval=timedelta(seconds=21600))
def sample_job():
    print("2s job current time") 
    # _getList(src) 
    _getListQuery(src)    
if __name__ == "__main__":
    _getListQuery(src)
    tl.start(block=True)


      