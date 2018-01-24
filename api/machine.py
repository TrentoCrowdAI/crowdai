import csv
import numpy as np
import pandas as pd
from Crowd import *
from helpers import compute_metrics
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.naive_bayes import BernoulliNB, MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.ensemble import BaggingClassifier
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix


import random


def _load_data(path):
    texts, labels, pmids = [], [], []
    csv_reader = csv.reader(open(path, 'rb'))
    csv_reader.next() # skip headers
    for r in csv_reader:
        pmid, label, text = r
        texts.append(text)
        labels.append(int(label))
        pmids.append(pmid)
    return texts, labels, pmids

def initialization(criteria_num):
    texts1, labels, pmids1 = _load_data('../data/proton-beam-merged.csv')

    labels = []
    texts = []
    pmids = []
    getcrowdvotequestion = Cmain(criteria_num)  # change the label with first question label!
    for item in getcrowdvotequestion.keys():
        pmids.append(item)
    for item in pmids:
        labels.append(getcrowdvotequestion[item])
    for item in pmids:
        index = pmids1.index(item)
        texts.append(texts1[index])

    data = np.array([t1 + t2 + t3 for t1, t2, t3 in zip(pmids, labels, texts)])
    data = pd.DataFrame(data, columns=['pmid', 'label', 'text'])

    return data
def classifyitems(classifier,TRset,TSset):

    if classifier=='KNN':
        knn_clf =  KNeighborsClassifier(weights='uniform')
        parameters_knn = {
                        'n_neighbors': [2,3,4]
                          }
        clf = GridSearchCV(knn_clf, parameters_knn,scoring='roc_auc', n_jobs=-1,cv=3)


    elif classifier=='SGD':
        params_d = {"alpha": 10.0 ** -np.arange(1, 7)}
        sgd = SGDClassifier(class_weight={1: 2}, random_state=42, penalty='l2')
        clf = GridSearchCV(sgd, params_d, scoring='roc_auc', cv=3)


    elif classifier=='RF':
        RF_clf = RandomForestClassifier(class_weight={1: 5}, random_state=42)
        parameters_RF = {
            'n_estimators': [300],  # 300 is enough
            'max_depth': [20]  # this is good fit
        }

        clf = GridSearchCV(RF_clf, parameters_RF, n_jobs=-1, scoring='roc_auc', cv=3)

    elif classifier=='MNB':
        clf = MultinomialNB()
    elif classifier=='BNB':
        clf = BernoulliNB()
    elif classifier=='GB':
        GB_clf = GradientBoostingClassifier(random_state=42, max_features=0.1)

        parameters_GB = {
            'n_estimators': [200],
            'learning_rate': [0.1]

        }

        gb_clf = GridSearchCV(GB_clf, parameters_GB, scoring='roc_auc', n_jobs=-1, cv=3)
    elif classifier=='SVM':
        clf =SVC(kernel='linear', class_weight={1: 2})

    clf = clf.fit(TRset[[2]], TRset[[1]])
    y_pred = clf.predict(TSset[[2]])


def machineRun(criteria_num, TR_size, TS_size, classifier,lr):

    poolset = initialization(criteria_num)
    randdata = (np.array(random.sample(poolset.values, TR_size))).tolist()
    TRset = pd.DataFrame(randdata, columns=['pmid', 'label', 'text'])
    poolset = poolset[~poolset['pid'].isin(randdata['pmid'])]



    while (1):
        alphaP = 1
        BetaP = 1
        alphaN = 1
        BetaN = 1
        randdata = (np.array(random.sample(poolset.values, TS_size))).tolist()
        TSset = pd.DataFrame(randdata, columns=['pmid', 'label', 'text'])
        pred_y = classifyitems(classifier,TRset,TSset)
        tn, fp, fn, tp = confusion_matrix(TSset[[1]], pred_y,labels=[0,1]).flatten()
        alphaP += tp
        BetaP += fp
        alphaN += tn
        BetaN += fn

        poolset = poolset[~poolset['pid'].isin(randdata['pmid'])]



