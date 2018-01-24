import random

from collections import defaultdict
import pandas as pd
from collections import Counter

class CrowsDis:

    def __init__(self, filename):
        self.filename = filename
        self.crowdAns = defaultdict(list)
        self.crowdVote = dict()
        self.crowdvotequestion1=dict()
        self.crowdvotequestion2 = dict()
        self.crowdvotequestion3 = dict()
        self.crowdvotequestion4 = dict()
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
        for k in self.crowdAns.keys():

            Q1=0
            Q2=0
            Q3=0
            Q4=0

            for p in range(5):

                    if (self.crowdAns[k][p]).split(',')[0] == "Yes" or (self.crowdAns[k][p]).split(',')[0] =="CantTell":

                       Q1 += 1
                    if (self.crowdAns[k][p]).split(',')[1] == "Yes" or (self.crowdAns[k][p]).split(',')[1] == "CantTell":
                        Q2+=1
                    if (self.crowdAns[k][p]).split(',')[2] == "Yes" or (self.crowdAns[k][p]).split(',')[2] == "CantTell":
                        Q3+=1
                    if (self.crowdAns[k][p]).split(',')[3]!='-' and (self.crowdAns[k][p]).split(',')[3]!="NoInfo":

                            if int((self.crowdAns[k][p]).split(',')[3])>= 10:
                             Q4+=1



            if (Q1 > 2 and Q2 > 2 and Q3 > 2 and Q4 > 2):
                self.crowdVote[k]=1
            else:
                self.crowdVote[k]=0
            if Q1 > 2:
                self.crowdvotequestion1[k]=1
            else:
                self.crowdvotequestion1[k]=0




    def powerC(self):
        result ={}
        countvotess = 0
        for k in self.crowdAns.keys():

            Q1=0
            Q2=0
            Q3=0
            Q4=0
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

                    if (self.crowdAns[k][p]).split(',')[1] == "Yes" or (self.crowdAns[k][p]).split(',')[1] == "CantTell":


                        Q2+=1

                    if (self.crowdAns[k][p]).split(',')[2] == "Yes" or (self.crowdAns[k][p]).split(',')[2] == "CantTell":


                        Q3+=1


                    if (self.crowdAns[k][p]).split(',')[3]!='-' and (self.crowdAns[k][p]).split(',')[3]!="NoInfo":

                            if int((self.crowdAns[k][p]).split(',')[3])>= 10:

                                Q4+=1


            if countvote1 > 0:
                MV = (countvote1 / 2) +1
                if Q1 >= MV :
                    self.crowdvotequestion1[k]=1
                else:
                    self.crowdvotequestion1[k]=0

            if countvote2 > 0:
                MV = (countvote2 / 2) + 1
                if Q2 >= MV:
                    self.crowdvotequestion2[k] = 1
                # else:
                #     self.crowdvotequestion2[k] = 0
                elif countvote2%2 ==0 and countvote2/2 != Q2:
                    self.crowdvotequestion2[k] = 0
            if countvote3 > 0:
                MV = (countvote3 / 2) + 1
                if Q3 >= MV:
                    self.crowdvotequestion3[k] = 1
                # else:
                #     self.crowdvotequestion3[k] = 0
                elif countvote3%2 ==0 and countvote3/2 != Q3:
                    self.crowdvotequestion3[k] = 0

            if countvote4 > 0:
                MV = (countvote4 / 2) + 1
                if Q4 >= MV:
                    self.crowdvotequestion4[k] = 1
                else:
                    self.crowdvotequestion4[k] = 0
                # elif countvote4%2 ==0 and countvote4/2 != Q4:
                #     self.crowdvotequestion4[k] = 0
            countvotess+=countvote4
        print 'countvotess'+str(countvotess)
        print 'crowdvotequestion4-'+str(len(self.crowdvotequestion4))



    def decisionwriting(self):

        for item in self.crowdVote.keys():
            with open('../data/voteProtonbeam.csv','w') as f:
                f.write(item+','+self.crowdVote[item]+'\n')

    def rndcrowddecision(self):

        rndC = random.sample(xrange(len(self.crowdVote)), 200)
        pos=[ y for x,y in self.crowdVote.items() if y=="1"]

        return  pos

    def workerdist(self):
        lines = []
        with open(self.filename) as f:
            lines = f.read().splitlines()
        workers = []
        for item in lines:
            workers.append(item.split('\t')[1])

        w = Counter(workers)
        for item in w :
            print str(item) +':'+str(w[item])

        return w



    def customizevoting(self, crowdnum, exclusionlist):

        print exclusionlist
        for k in self.crowdAns.keys():


            Q1 = 0
            Q2 = 0
            Q3 = 0
            Q4 = 0

            for p in range(crowdnum):
                if p in exclusionlist:
                    continue

                if (self.crowdAns[k][p]).split(',')[0] == "Yes" or (self.crowdAns[k][p]).split(',')[0] == "CantTell":
                    Q1 += 1
                if (self.crowdAns[k][p]).split(',')[1] == "Yes" or (self.crowdAns[k][p]).split(',')[1] == "CantTell":
                    Q2 += 1
                if (self.crowdAns[k][p]).split(',')[2] == "Yes" or (self.crowdAns[k][p]).split(',')[2] == "CantTell":
                    Q3 += 1
                if (self.crowdAns[k][p]).split(',')[3] != '-' and (self.crowdAns[k][p]).split(',')[3] != "NoInfo":

                    if int((self.crowdAns[k][p]).split(',')[3]) >= 10:
                        Q4 += 1

            # minvote = crowdnum - len(exclusionlist)
            # if minvote % 2 == 0: # if is even
            #     minvote = minvote/2
            # elif minvote % 2 ==1:
            #     minvote = (minvote / 2) + 1
            minvote = crowdnum - len(exclusionlist)


            if(Q1 >= minvote):
            # if (Q1 >= minvote and Q2 >= minvote and Q3 >= minvote and Q4 >= minvote):
                self.crowdVote[k] = 1
            else:
                self.crowdVote[k] = 0

        return self.crowdVote



    def getvotes(self):
        return self.crowdVote
    def getcrowdAns(self):
        return  self.crowdAns

    def getcrowdvotequestion1(self):
        return self.crowdvotequestion1
    def getcrowdvotequestion2(self):
        return self.crowdvotequestion2



    def wallaceExpriment(self, strategy):

        for k in self.crowdAns.keys():


            Q1 = 0
            Q2 = 0
            Q3 = 0
            Q4 = 0

            for p in range(5):


                if (self.crowdAns[k][p]).split(',')[0] == "Yes" or (self.crowdAns[k][p]).split(',')[0] == "CantTell":
                    Q1 += 1
                if (self.crowdAns[k][p]).split(',')[1] == "Yes" or (self.crowdAns[k][p]).split(',')[1] == "CantTell":
                    Q2 += 1
                if (self.crowdAns[k][p]).split(',')[2] == "Yes" or (self.crowdAns[k][p]).split(',')[2] == "CantTell":
                    Q3 += 1
                if (self.crowdAns[k][p]).split(',')[3] != '-' and (self.crowdAns[k][p]).split(',')[3] != "NoInfo":

                    if int((self.crowdAns[k][p]).split(',')[3]) >= 10:
                        Q4 += 1





            if (Q1 >= strategy and Q2 >= strategy and Q3 >= strategy and Q4 >= strategy):
                self.crowdVote[k] = 1
            else:
                self.crowdVote[k] = 0

        return self.crowdVote


    def getvotesofeachworker(self):
        workers = defaultdict(dict)
        lines = []
        with open(self.filename) as f:
            lines = f.read().splitlines()
        for line in lines:
            items = line.split('\t')
            if items[10]=='Yes' or items[10]=='CantTell':
                workers[items[1]][items[7]] = 1
            elif items[10]=='No' or items[10]=='NoInfo':
                workers[items[1]][items[7]] = 0

        return workers




