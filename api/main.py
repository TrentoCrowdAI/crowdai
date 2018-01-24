import numpy as np
import pandas as pd
from machine import *




if __name__ == '__main__':

    # n_papers = 1000
    # criteria_power = [0.14, 0.14, 0.28, 0.42]
    # criteria_difficulty = [1., 1., 1.1, 0.9]
    criteria_num = 2
    TR_size = 10
    TS_size = 5
    classifiers = ['MNB','BNB','SGD','RF','KNN','GB','SVM']
    corr = [0., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    lr = 5
    for classifier in classifiers:


        loss_me_list = []
        fp_me, tp_me, rec_me, pre_me, f_me, f_me = [], [], [], [], [], []
        data = []

        for _ in range(10):


            # machine ensemble
            loss_me, fp_rate_me, tp_rate_me, \
            rec_me_, pre_me_, f_beta_me, prior_prob_in = machineRun(criteria_num, TR_size, TS_size, classifier)
            loss_me_list.append(loss_me)
            fp_me.append(fp_rate_me)
            tp_me.append(tp_rate_me)
            rec_me.append(rec_me_)
            pre_me.append(pre_me_)
            f_me.append(f_beta_me)




        print('ME-RUN    loss: {:1.2f}, fp_rate: {:1.2f}, tp_rate: {:1.2f}, ' \
              'recall: {:1.2f}, precision: {:1.2f}, f_b: {}'. \
              format(np.mean(loss_me_list), np.mean(fp_me), np.mean(tp_me),
                     np.mean(rec_me), np.mean(pre_me), np.mean(f_me)))


        print('---------------------')

        data.append([lr, np.mean(loss_me_list), np.std(loss_me_list),
                     np.mean(fp_me), np.mean(tp_me), 0., 0., 'Machines-Ensemble',
                     np.mean(rec_me), np.mean(pre_me), np.mean(f_me),corr])

    pd.DataFrame(data, columns=['Nt', 'J', 'lr', 'loss_mean', 'loss_std', 'FPR', 'TPR',
                                'price_mean', 'price_std', 'alg', 'recall', 'precision',
                                'f_beta', 'Nm', 'corr']). \
                                to_csv('output/data/fig5_acc05_095_1000items_conf99.csv', index=False)