from Crowdproportion import CrowsDis


def Cmain(criteria):#for asking whole
    cp=CrowsDis("../data/ProtonBeamCrowddata.txt")
    cp.proportion()
    cp.voting()
    return cp.crowdvotequestion[criteria],cp.crowdNvotequestion[criteria]






