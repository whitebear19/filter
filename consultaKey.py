''' for web integration '''
import os
import re
import csv
import sys
import json
import time
import shutil
import requests

from zipfile import ZipFile
from datetime import date
from pathlib import Path

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver import ActionChains 
from selenium.common.exceptions import NoSuchElementException
path = os.path.dirname(os.path.abspath(__file__))
src = 'https://www.guatecompras.gt/concursos/consultaConcursos.aspx?o=1&d=1'
option = webdriver.ChromeOptions()
option.add_argument("--window-size=900,700")
driver = webdriver.Chrome(path+"/chromedriver",options = option)


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
def createFolder(directory):    
    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print ('Error: Creating directory. ' +  directory)

def get_all_file_paths(directory):  
    file_paths = []     
    for root, directories, files in os.walk(directory): 
        for filename in files:              
            filepath = os.path.join(root, filename) 
            file_paths.append(filepath)    
    print("*"*100)
    print("directory:"+directory)
    print("*"*100)
    print("file_paths")   
    print(file_paths)    
    return file_paths         
  
def mainZip(directory):   
    file_paths = get_all_file_paths(directory)     
    with ZipFile(directory+'.zip','w') as zip: 
        # writing each file one by one 
        for file in file_paths: 
            zip.write(file)   
            print("file")
            print(file)
    print(' ... ',directory,'zip file was created successfully.') 
    filename = directory+".zip"
    print("::"+filename+"::")

def downPdf(url,name): 
    print('Now it is downloading {string}'.format(string=name))       
    r = requests.get(url, stream=True)
    filename=Path(path+"/"+name)
    filename.write_bytes(r.content)


def _getContent(url):
    Edict,Tdict2, Tdict3,Tlst2,Tlst3 = {},{},{},[],[]
    baseurl = 'https://www.guatecompras.gt'
    driver.get(url)
    time.sleep(1)
    detailTable = driver.find_element_by_id('MasterGC_ContentBlockHolder_WUCDetalleConcurso_divDetalleConcurso')
    con = detailTable.find_element_by_class_name('TablaForm3')
    page = con.get_attribute('innerHTML')
    soup = BeautifulSoup(page,'html.parser')
    rows = soup.find_all('div',attrs={'class':'row'})
    for i in range(len(rows)):
        field = rows[i].find('div',attrs={'class':'col-xs-12 col-md-3 EtiquetaForm3'}).get_text().strip()
        val = rows[i].find('div',attrs={'class':'col-xs-12 col-md-9 EtiquetaInfo'}).get_text().strip()
        Edict[field] = val 
    footer = driver.find_element_by_class_name('lnk-footer')
    action = ActionChains(driver)
    action.move_to_element(footer).perform()
    time.sleep(1)
    ul = driver.find_element_by_class_name('rtsLevel.rtsLevel1') 
    li5 = ul.find_element_by_class_name('rtsLI.rtsLast')
    print('- His button check:',li5.text)
    li5.click()
    for t in range(20):
        try:
            li5.text
        except Exception as er:                        
            time.sleep(3)
            break
    time.sleep(1)    
    historialTable = driver.find_element_by_id('MasterGC_ContentBlockHolder_RMP_Historia')
    con2 = historialTable.find_element_by_class_name('TablaDetalle')
    page2 = con2.get_attribute('innerHTML')
    soup2 = BeautifulSoup(page2,'html.parser')
    rows2 = soup2.find_all('tr',attrs={'class':'FilaTablaDetalle'})
    derectoryName = re.search(r'\d+',url).group()
    createFolder(path+'/'+derectoryName)
    for j in range(len(rows2)):        
        ahs = rows2[j].find_all('td')[-1].find_all('a')
        if len(ahs) != []:
            for k in range(len(ahs)):
                ahref = baseurl + ahs[k].get('href')                
                atext = ahref.split('/')[-1].replace('.pdf','').replace('.doc','').replace('.zip','').replace('.PDF','').replace('.DOC','').replace('.xls','')
                if ahref.split('/')[-1][-3:] == 'pdf' or ahref.split('/')[-1][-3:] == 'PDF':
                    ext = 'pdf' 
                elif ahref.split('/')[-1][-3:] == 'doc' or ahref.split('/')[-1][-3:] == 'DOC':
                    ext = 'doc'
                elif ahref.split('/')[-1][-3:] == 'zip':
                    ext = 'zip'
                elif ahref.split('/')[-1][-3:] == 'xls':
                    ext = 'xls'
                ''' donwloading pdf files '''
                downPdf(ahref,derectoryName+'/'+atext+'.'+ext)
    footer = driver.find_element_by_class_name('lnk-footer')
    action = ActionChains(driver)
    action.move_to_element(footer).perform()
    time.sleep(1)
    ul = driver.find_element_by_class_name('rtsLevel.rtsLevel1') 
    lis3 = ul.find_elements_by_class_name('rtsLI')     
    # --- finding Req button 
    for b in range(len(lis3)):
        if 'Requisitos de las Bases' in lis3[b].text :            
            li3 = lis3[b]
            print('- Req button check:',li3.text)
            li3.click()
            break    
    for t in range(20):
        try:
            li3.text
        except Exception as er:                        
            time.sleep(3)
            break
    time.sleep(1)    
    con3 = driver.find_element_by_id('MasterGC_ContentBlockHolder_wuCRequisitosFundamentales_wuCRequisitosUsuario_divRequisitosUsuario')
    page3 = con3.get_attribute('innerHTML')
    soup3 = BeautifulSoup(page3,'html.parser')
    rows3 = soup3.find_all('div',attrs={'class':'accordionCabecera'})
    for l in range(len(rows3)):
        val = rows3[l].find_all('td')[1].get_text().strip()+' '+rows3[l].find_all('td')[2].get_text().strip()
        Tdict2[str(l+1)] = val        
    Tlst2.append(Tdict2) 
    footer = driver.find_element_by_class_name('lnk-footer')
    action = ActionChains(driver)
    action.move_to_element(footer).perform()
    time.sleep(1)
    ul = driver.find_element_by_class_name('rtsLevel.rtsLevel1') 
    lis2 = ul.find_elements_by_class_name('rtsLI')
    # --- finding Tip button 
    for b in range(len(lis2)):
        if 'Tipos de Producto' in lis2[b].text :
            li2 = lis2[b]
            print('- Tip button check:',li2.text)            
            li2.click()
            break 
    for t in range(20):
        try:
            li2.text
        except Exception as er:                        
            time.sleep(3)
            break
    time.sleep(1)   
    con4 = driver.find_element_by_id('MasterGC_ContentBlockHolder_wcuConsultaConcursoProductosPub_divTipoProducto')
    page4 = con4.get_attribute('innerHTML')
    soup4 = BeautifulSoup(page4,'html.parser')
    rows4 = soup4.find_all('th')
    fieldlst = [rows4[m].get_text().strip() for m in range(len(rows4)-1)]
    trs = soup4.find_all('tr',attrs={'class':'FilaTablaDetalle'})
    for n in range(len(trs)):
        Tdict3 = {}
        for e in range(len(fieldlst)):
            Tdict3[fieldlst[e]] = trs[n].find_all('td')[e].get_text().strip()
        Tlst3.append(Tdict3)
    # print('_getContent check Edict, Tlst2, Tlst3 :',Edict,Tlst2,Tlst3)
    return Edict,Tlst2,Tlst3


def _Indiviual(url,nog):
    Dict={}
    # for i in range(len(lst)):
    #     if lst[i][0] == str(nog):
            # url = lst[i][8].split('||')[1]                        
    Edict,lst2,lst3 = _getContent(url)
    Dict[str(nog)] = Edict
    Dict['Req'] = lst2
    Dict['Tip'] = lst3 
            # break               
    return Dict                
def _getDetail(url,nog):
    Dict = {}
    # lst = _readCsv(path+'/'+filename)
    print('*'*70)
    print('*'*15,'getting Detail with index of element','*'*15)    
    # nog = input('Enter index(NOG):')     
    print('nog check:',url)
    reDict = _Indiviual(url,nog)
    if reDict == {} :
        print("** It doesn't exist Modaliadad field or there isn't {index} on current.csv file. **".format(index=nog))
    else:
        Dict[str(nog)] = reDict        
        with open(path+'/'+nog+'/'+nog+'consulta.json', 'w', encoding='utf-8') as jsonf:
            jsonf.write(json.dumps(Dict, indent=4)) 

''' part for keyword script from here '''
def _getPagenation(driver):
    countInfoS = driver.find_element_by_id('MasterGC_ContentBlockHolder_lblFilas')
    st = countInfoS.text      
    print('countINfo : ',st)
    countInfo = re.findall(r'\d+',st)
    if len(countInfo) == 5 and countInfo[1] != countInfo[2]:
        total = countInfo[2]+countInfo[3]+countInfo[4]
    elif len(countInfo) == 4 and countInfo[1] != countInfo[2]:
        total = countInfo[2]+countInfo[3]
    elif len(countInfo) == 3 and countInfo[1] != countInfo[2]:
        total = countInfo[2]
    elif len(countInfo) == 3 and countInfo[1] == countInfo[2]:
        total = 1
    di = countInfo[1]
    pgcount = int(total)//int(di)+1      
    return pgcount

def _getOnepagelst(driver):
    lst = []
    tb = driver.find_element_by_class_name('tableContainer2')
    con = tb.find_elements_by_class_name('Tabla1')[1]
    trs = con.find_elements_by_tag_name('tr')
    ''' In here It can set row count. '''    
    for i in range(5): # len(trs)       
        onelst = []
        attrs = trs[i].get_attribute('class')
        if attrs == 'TablaFilaMix1' or attrs == 'TablaFilaMix2':
            tds = trs[i].find_elements_by_tag_name('td')
            aaS = tds[0].find_element_by_tag_name('a')
            ahref = aaS.get_attribute('href')
            aa = '{t1}||{u1}'.format(t1=aaS.text,u1=ahref)
            bb = tds[0].find_elements_by_tag_name('span')[0].text
            cc = tds[0].find_elements_by_tag_name('span')[1].text
            ee = tds[0].find_elements_by_tag_name('span')[4].text
            ff = tds[1].find_elements_by_tag_name('span')[0].text
            gg = tds[1].find_elements_by_tag_name('span')[1].text
            hh = tds[1].find_elements_by_tag_name('span')[2].text
            hrefs = tds[1].find_elements_by_tag_name('a')
            dd = tds[1].find_elements_by_tag_name('a')[0].text
            ii = ''
            print('--len(hrefs) : ',len(hrefs))
            if len(hrefs) == 2:                
                eeS = tds[1].find_elements_by_tag_name('a')[0]                
                if 'Terminado adjudicado' in ee :
                    ii = eeS.get_attribute('href')
                else:
                    ii = ''
            onelst.append(aa)
            onelst.append(bb)
            onelst.append(cc)
            onelst.append(dd)
            onelst.append(ee)
            onelst.append(ff)
            onelst.append(gg)
            onelst.append(hh)
            onelst.append(ii)
            lst.append(onelst)
           
    return lst

def _getListK(driver,word,nog):    
    time.sleep(2)
    lst = [['a','b','c','d','e','f','g','h','i']]
    pgnation = _getPagenation(driver)
    if pgnation > 1 :
        ''' In here It can set pagenation '''
        for p in range(0,2): # pgnation
            time.sleep(1)
            # -- call _getOnepagelst function ---
            onelst = _getOnepagelst(driver)
            tb = driver.find_element_by_class_name('tableContainer2')
            con = tb.find_elements_by_class_name('Tabla1')[1]
            footer = con.find_element_by_class_name('TablaPagineo')
            actions = ActionChains(driver)
            actions.move_to_element(footer)
            actions.perform()
            pagenationButtons = footer.find_elements_by_tag_name('a')
            print('-110 check pagebuttons:',pagenationButtons[p].text)
            pagenationButtons[p].click() 
            for t in range(20):
                try:            
                    pagenationButtons[p].text
                except Exception as err :                    
                    time.sleep(3)
                    break                
                time.sleep(1)
            lst = lst + onelst
            if p == pgnation:
                onelst = _getOnepagelst(driver)
                lst = lst +onelst            
    else:
        onelst = _getOnepagelst(driver)
        lst = lst + onelst
    _writeCsv(path+'/'+nog+'/keyword_'+word,lst)    

def _getContentK(driver,word,nog1):
    if os.path.exists(path+'/'+nog1+'/keyword_'+word+'.csv'):
        urllst = _readCsv(path+'/'+nog1+'/keyword_'+word)
        ''' It can set count of rows in csv file. '''
        Dict = {}
        q = 0
        for i in range(1,len(urllst)): #             
            nog = urllst[i][0].split('||')[0]
            url = urllst[i][8]
            if url != '':
                print('... [NOG] ',nog)
                q += 1
                Dict[str(q)] = {}
                driver.get(url)
                time.sleep(2)
                div = driver.find_element_by_id('MasterGC_ContentBlockHolder_ctl00')
                tb1 = div.find_element_by_class_name('TablaForm3')
                rows = tb1.find_elements_by_class_name('row')
                for j in range(len(rows)):
                    field = rows[j].find_element_by_class_name('col-xs-12.col-md-3.EtiquetaForm3').text.strip()
                    val = rows[j].find_element_by_class_name('col-xs-12.col-md-9.EtiquetaInfo').text.strip()
                    Dict[str(q)][str(j)] = val
                # -- click Tipos button --
                bdiv = driver.find_element_by_class_name('rtsLevel.rtsLevel1')
                action = ActionChains(driver)
                action.move_to_element(bdiv).perform()
                time.sleep(1) 
                tipoBtn = bdiv.find_elements_by_class_name('rtsLI')[2]
                print('-- check Tipo button : ',tipoBtn.text)
                tipoBtn.click()
                for t in range(20):
                    try:
                        tipoBtn.text
                    except Exception as er:                        
                        time.sleep(3)
                        break
                    time.sleep(1)
                pgnationInfo = driver.find_element_by_id('MasterGC_ContentBlockHolder_wcuConsultaConcursoProductosPub_lblFilas').text
                print('- check pagenation in Tipo : ',pgnationInfo)
                tb2 = driver.find_element_by_id('MasterGC_ContentBlockHolder_wcuConsultaConcursoProductosPub_divTipoProducto')
                trs = tb2.find_elements_by_tag_name('tr')
                tipolst = []
                for k in range(len(trs)):                    
                    attrs = trs[k].get_attribute('class')
                    if attrs == 'FilaTablaDetalle':
                        Edict = {}
                        tds = trs[k].find_elements_by_tag_name('td')
                        ''' ths: Nombre, Cantidad, Precio de Referencia, Unidad de Medidad ''' 
                        for d in range(len(tds)-1):
                            Edict[str(d)] = tds[d].text.strip()
                        tipolst.append(Edict)
                Dict[str(q)]['T1'] = tipolst
                # -- click proceso button --
                bdiv = driver.find_element_by_class_name('rtsLevel.rtsLevel1')
                action = ActionChains(driver)
                action.move_to_element(bdiv).perform()
                time.sleep(1) 
                procesoBtn = bdiv.find_elements_by_class_name('rtsLI')[3]
                print('-- check proceso button : ',procesoBtn.text)
                procesoBtn.click()
                for t in range(20):
                    try:
                        procesoBtn.text
                    except Exception as er:                        
                        time.sleep(3)
                        break
                    time.sleep(1)
                tb3 = driver.find_element_by_id('MasterGC_ContentBlockHolder_wcuConsultaConcursoAdjudicaciones_divOfertas')            
                trs = tb3.find_elements_by_tag_name('tr')
                procesolst1 = []
                for k in range(len(trs)):                    
                    attrs = trs[k].get_attribute('class')
                    if attrs == 'FilaTablaDetalle':
                        Edict = {}
                        tds = trs[k].find_elements_by_tag_name('td')
                        ''' ths: NIT o país, Nombre o razón social, Entidad Afianzadora,
                            Monto total ofertado, Monto Seguro de Caución '''
                        for d in range(len(tds)-1):
                            Edict[str(d)] = tds[d].text.strip()
                        procesolst1.append(Edict)
                Dict[str(q)]['T2'] = procesolst1
                tb4 = driver.find_element_by_id('MasterGC_ContentBlockHolder_wcuConsultaConcursoAdjudicaciones_acDocumentos')
                trs = tb4.find_elements_by_tag_name('tr') 
                procesolst2 = []           
                for k in range(len(trs)):
                    Edict = {}
                    tds = trs[k].find_elements_by_tag_name('td')
                    ''' ths: NIT o país, Nombre o razón social, Contrato, Monto '''
                    for d in range(1,len(tds)):
                        Edict[str(d)] = tds[d].text.strip()
                    procesolst2.append(Edict)
                Dict[str(q)]['T3'] = procesolst2
                # -- write json file --
                with open(path+'/'+nog1+'/keyword_'+word+'.json', 'w', encoding='utf-8') as jsonf:
                    jsonf.write(json.dumps(Dict, indent=4)) 
            else:
                print(' ! No Teminado field.')
        driver.close()


def main6(nogurl,nog):    
    # _getList(src) 
    _getDetail(nogurl,nog)
    driver.close()
    

def main11(word,nog): 
    basesrc = 'https://www.guatecompras.gt/concursos/busquedaTexto.aspx?t={}'
    print('\n','*'*15,' Enter your keyword. ','*'*15)
    # word = input('[keyword] : ')    
    option = webdriver.ChromeOptions()
    option.add_argument("--window-size=900,700")
    driver = webdriver.Chrome(path+"/chromedriver",options = option)
    src = basesrc.format(word) 
    driver.get(src)  
    _getListK(driver,word,nog)
    _getContentK(driver,word,nog)    

# -- Call main6 main11 function --
''' formart of command is following
    consultaKey.py https://www.guatecompras.gt/concursos/consultaConcurso.aspx?nog=13917587 NITRILO '''
if __name__ == "__main__":
    t1 = time.time()
    try:
        if os.path.exists(path+'/debug.log'):
            os.unlink(path+'/debug.log')
    except Exception as er:
        pass
    nogurl = 'https://www.guatecompras.gt/concursos/consultaConcurso.aspx?nog=13920227' # 13917587 13920227 13927698 13921630
    nog = nogurl[nogurl.find('nog='):len(nogurl)].replace('nog=','')
    word = 'NITRILO'
    # if len(sys.argv) > 1 :    
    #     for i in range(2,len(sys.argv)):
    #         word += ' ' + sys.argv[i]     
    main6(nogurl,nog)
    if word != '':
        main11(word,nog)
    mainZip(nog)
    location = path+"/"
    paths = os.path.join(location, nog)  
    # shutil.rmtree(paths)     
    t2 = time.time()
    print('--- running time --')
    print(t2-t1)
    








    
    
