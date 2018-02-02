def compute_metrics(classified_papers, GT, lr, criteria_num):
    lr = 5
    # obtain GT scope values for papers
    GT_scope = []
    for paper_id in range(len(classified_papers)):
        if sum([GT[paper_id * criteria_num + e_paper_id] for e_paper_id in range(criteria_num)]):
            GT_scope.append(0)
        else:
            GT_scope.append(1)
    # FP == False Exclusion
    # FN == False Inclusion
    fp = 0.
    fn = 0.
    tp = 0.
    tn = 0.
    for cl_val, gt_val in zip(classified_papers, GT_scope):
        if gt_val and not cl_val:
            fp += 1
        if not gt_val and cl_val:
            fn += 1
        if gt_val and cl_val:
            tn += 1
        if not gt_val and not cl_val:
            tp += 1
    tp_rate = tp / (fn + tp)
    fp_rate = fp / (fp + tn)
    recall = tp / (tp + fn)
    precision = tp / (tp + fp)
    loss = (fp * lr + fn) / len(classified_papers)
    beta = 1. / lr
    f_beta = (beta + 1) * precision * recall / (beta * recall + precision)
    return loss, fp_rate, tp_rate, recall, precision, f_beta


def compute_measures(tn, fp, fn, tp):
    R = 10
    tp = float(tp)
    fp = float(fp)
    fn = float(fn)
    tn = float(tn)
    print 'tp'+str(tp)
    print 'fp'+str(fp)
    print 'fn'+str(fn)
    print 'tn'+str(tn)
    if (tp+fn) == 0:
        sensitivity = 0
    else:
        sensitivity = tp / (tp + fn)
    if (tn+fp) == 0:
        specificity = 0
    else:
        specificity = tn / (tn + fp)
    if (tp+fp) == 0:
        precision = 0
    else:
        precision  = tp / (tp + fp)
    if (tn+fn) == 0:
        precisionOut = 0
    else:
        precisionOut = tn / (tn + fn)

    loss = (fp+(R*fn))/ (tp+fp+fn+tn)
    #man = fp / (tp+fp)
    return sensitivity, specificity, precision, precisionOut