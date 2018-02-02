import random

from collections import defaultdict
import pandas as pd
from collections import Counter

class CrowsDis:

    def __init__(self, filename,criterianum):
        self.filename = filename
        self.crowdAns = defaultdict(list)
        self.crowdVote = dict()
        self.crowdvotequestion = [{} for _ in range(criterianum)]
        self.crowdNvotequestion = [{} for _ in range(criterianum)]
        self.workerforeachpaper=defaultdict(list)


    def proportion(self):
        lines=[]
        with open(self.filename) as f:

            lines = f.read().splitlines()



        for item in lines:

            info=item.split('\t')

            self.crowdAns[info[7]].append(info[9] +','+ info[10] + ',' +info[11] +','+info[12])
            self.workerforeachpaper[info[7]].append(info[1])

    def voting(self):
        result ={}
        countvotess = 0
        for k in self.crowdAns.keys():

            Q1=0
            Q2=0
            Q3=0
            Q4=0
            NQ1 = 0
            NQ2 = 0
            NQ3 = 0
            NQ4 = 0
            countvote1 = 0
            countvote2 = 0
            countvote3 = 0
            countvote4 = 0
            for p in range(5):

                    if (self.crowdAns[k][p]).split(',')[0] !='-':
                        countvote1+=1

                    if (self.crowdAns[k][p]).split(',')[1] != '-':
                       countvote2+=1

                    if (self.crowdAns[k][p]).split(',')[2] != '-':
                        countvote3+=1


                    if (self.crowdAns[k][p]).split(',')[3]!='-':


                        countvote4+=1
            for p in range(5):

                    if (self.crowdAns[k][p]).split(',')[0] == "Yes" or (self.crowdAns[k][p]).split(',')[0] =="CantTell":
                        Q1 += 1

                    if (self.crowdAns[k][p]).split(',')[0] == "No" or (self.crowdAns[k][p]).split(',')[0] == "NoInfo":
                        NQ1 += 1

                    if (self.crowdAns[k][p]).split(',')[1] == "Yes" or (self.crowdAns[k][p]).split(',')[1] == "CantTell":
                        Q2+=1

                    if (self.crowdAns[k][p]).split(',')[1] == "No" or (self.crowdAns[k][p]).split(',')[1] == "NoInfo":
                        NQ2 += 1

                    if (self.crowdAns[k][p]).split(',')[2] == "Yes" or (self.crowdAns[k][p]).split(',')[2] == "CantTell":
                        Q3+=1

                    if (self.crowdAns[k][p]).split(',')[2] == "No" or (self.crowdAns[k][p]).split(',')[1] == "NoInfo":
                        NQ3 += 1

                    if (self.crowdAns[k][p]).split(',')[3]!='-' and (self.crowdAns[k][p]).split(',')[3]!="NoInfo":

                            if int((self.crowdAns[k][p]).split(',')[3])>= 10:

                                Q4+=1
                    if (self.crowdAns[k][p]).split(',')[2] == "No" or (self.crowdAns[k][p]).split(',')[1] == "NoInfo":
                        NQ4 += 1

            if countvote1 > 0:
                MV = (countvote1 / 2) +1
                if Q1 >= MV :

                    self.crowdvotequestion[0][k]=1

                else:
                    self.crowdvotequestion[0][k] = 0
                self.crowdNvotequestion[0][k] = NQ1 / float(countvote1)
            if countvote2 > 0:
                MV = (countvote2 / 2) + 1
                if Q2 >= MV:
                    self.crowdvotequestion[1][k] = 1

                elif countvote2%2 ==0 and countvote2/2 != Q2:
                    self.crowdvotequestion[1][k] = 0
                self.crowdNvotequestion[1][k] = NQ2 / float(countvote2)
            if countvote3 > 0:
                MV = (countvote3 / 2) + 1
                if Q3 >= MV:
                    self.crowdvotequestion[2][k] = 1
                elif countvote3%2 ==0 and countvote3/2 != Q3:
                    self.crowdvotequestion[2][k] = 0
                self.crowdNvotequestion[2][k] = NQ3 / float(countvote3)
            if countvote4 > 0:
                MV = (countvote4 / 2) + 1
                if Q4 >= MV:
                    self.crowdvotequestion[3][k] = 1
                elif countvote4%2 ==0 and countvote4/2 != Q4:
                    self.crowdvotequestion[3][k] = 0
                self.crowdNvotequestion[3][k] = NQ4 / float(countvote4)
            countvotess+=countvote4
        print 'countvotess'+str(countvotess)
        print 'crowdvotequestion4-'+str(len(self.crowdvotequestion4))



