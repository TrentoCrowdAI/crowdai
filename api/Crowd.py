from Crowdproportion import CrowsDis
import numpy as np
import pandas as pd
import itertools
from collections import defaultdict
import  os
from scoring import compute_measures
from sklearn.metrics import confusion_matrix

def Cmain():#for asking whole
    cp=CrowsDis("../data/ProtonBeamCrowddata.txt")
    cp.proportion()
    # cp.voting()
    cp.powerC()

    return cp.getcrowdvotequestion2()
    # return cp.getcrowdvotequestion1()



def getworkereachpaper():
    cp = CrowsDis("../data/ProtonBeamCrowddata.txt")
    cp.proportion()
    return cp.workerforeachpaper
def askCrowd(data,mode):#for asking a sample from crowd
    cp=CrowsDis("../data/ProtonBeamCrowddata.txt")
    cp.proportion()
    cp.voting()
    feature_dict = {i: label for i, label in zip(
        range(3),
        ('pmid',
         'text',
         'label'))}

    crowddata = (data[[0, 1]].values).tolist()
    label = []
    if mode=='all':

        for i in range(0,len(data["pmid"])):
            label.append(cp.getvotes()[data['pmid'][i]])

    if mode=='1':
        pidval = data['pmid'].values
        for i in range(0,len(data["pmid"])):

            label.append(cp.getcrowdvotequestion1()[pidval[i]])


    crowdlabel = (np.array([label]).T).tolist()
    data = np.array([t1 + t2 for t1, t2 in zip(crowddata, crowdlabel)])
    columns = [l for i, l in sorted(feature_dict.items())]

    return pd.DataFrame(data,columns=columns)#make dataframe from M sample


def getworkerdistribution():
    cp = CrowsDis("../data/ProtonBeamCrowddata.txt")
    return cp.workerdist()


def getcustomizevoting(crowdlist,pid):
    result = defaultdict(list)
    cp = CrowsDis("../data/ProtonBeamCrowddata.txt")
    cp.proportion()


    combinationcrowd = []
    for i in xrange(4, len(crowdlist)):
        combinationcrowd.append(list(itertools.combinations(crowdlist, i)))

    for indexgroup in range(len(combinationcrowd)):#

        for item in range(len(combinationcrowd[indexgroup])):
            label = [] # convert crowd votes dict to ordered labels
            cp.customizevoting(len(crowdlist), list(combinationcrowd[indexgroup][item]))
            print cp.getvotes()
            for item in pid:
                label.append(cp.getvotes()[item]) # to be add lables in the same order

            result[indexgroup].append(label)





    return result

def getexpertvotes_label():
    current_dir = os.path.abspath(os.path.dirname(__file__))
    dataset = pd.read_csv(os.path.join(os.path.abspath(current_dir + "/../"), 'data', 'ProtonBeamComplete.txt'),
                          header=0,
                          delimiter='\t', quoting=3)

    y_real = [val for sublist in dataset[[5]].values for val in sublist]
    pid = [val for sublist in dataset[[3]].values for val in sublist]
    pid = [str(i) for i in pid]
    return y_real,pid


def wallace(pid, y_real):
    cp = CrowsDis("../data/ProtonBeamCrowddata.txt")
    cp.proportion()

    for i in range(1,6):
        print i
        label = []
        cp.wallaceExpriment(i)
        for item in pid:
            label.append(cp.getvotes()[item])
        cm = confusion_matrix(y_real,label).flatten()
        sensitivity, specificity, precision, loss=compute_measures(*cm)
        print sensitivity
        print specificity


def getvoteforeachpaper():
    cp = CrowsDis("../data/ProtonBeamCrowddata.txt")
    return cp.getvotesofeachworker()



def updatevote(paperupate):
    print paperupate
    cp = CrowsDis("../data/ProtonBeamCrowddata.txt")
    cp.proportion()
    crowdans = cp.getcrowdAns()
    print crowdans
    for item in paperupate:
         ans=(crowdans[item[0]][item[1]])
         if item[2] == 1:
             new_ans ='Yes'
         else:
             new_ans = 'No'

         ans=new_ans+','+ans.split(',')[1] +','+ans.split(',')[2]+','+ans.split(',')[3]
         print  crowdans[item[0]][item[1]]
         crowdans[item[0]][item[1]]= ans
         print crowdans[item[0]][item[1]]

    cp.voting()
    return cp.crowdvotequestion1




# y_real,pid=getexpertvotes_label()
# # wallace(pid,y_real)
# votes = Cmain()
# label = []
# for item in pid:
#     label.append(votes[item])
# cm = confusion_matrix(y_real,label).flatten()
# sensitivity, specificity, precision, loss=compute_measures(*cm)
# print sensitivity
# print specificity

# getworkerdistribution()

