import numpy as np
import pandas as pd
from machine import *




if __name__ == '__main__':

    # n_papers = 1000
    # criteria_power = [0.14, 0.14, 0.28, 0.42]
    # criteria_difficulty = [1., 1., 1.1, 0.9]
    criteria_num = 1
    TR_size = 10
    TS_size = 5
    classifiers = ['MNB','BNB','SGD','RF','KNN','GB','SVM']
    K = 5
    th = 0.5
    # corr = [0., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    # lr = 5
    for classifier in classifiers:


        for criteria_index in range(criteria_num):
            # machine ensemble
            machineRun(criteria_index, TR_size, TS_size, classifier,K,th)





