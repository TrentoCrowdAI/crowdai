import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'

const cohen2 =
[
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "ac6pi4sad0n05",
      "number of common tasks": 2,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 8,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 2,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 10,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3mwv912lnfd67",
      "number of common tasks": 2,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1zq7a1cuv6rd8",
      "number of common tasks": 2,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a2ybgz2h2kso5t",
      "number of common tasks": 10,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "arb4paabfrza4",
      "number of common tasks": 8,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "apul86331somr",
      "number of common tasks": 2,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "apul86331somr",
      "number of common tasks": 2,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a34m93njc830dp",
      "number of common tasks": 10,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "a2ybgz2h2kso5t",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 10,
      "cohen's kappa correlation": 1
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "apul86331somr",
      "number of common tasks": 19,
      "cohen's kappa correlation": 0.8
    },
    {
      "worker A": "apul86331somr",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 19,
      "cohen's kappa correlation": 0.8
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.788
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a34m93njc830dp",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.788
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a16aksclsvcw9a",
      "number of common tasks": 19,
      "cohen's kappa correlation": 0.784
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 19,
      "cohen's kappa correlation": 0.784
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "apul86331somr",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.774
    },
    {
      "worker A": "apul86331somr",
      "worker B": "ac6pi4sad0n05",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.774
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 32,
      "cohen's kappa correlation": 0.758
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 32,
      "cohen's kappa correlation": 0.758
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.741
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.741
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "apul86331somr",
      "number of common tasks": 34,
      "cohen's kappa correlation": 0.739
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 34,
      "cohen's kappa correlation": 0.739
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.697
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.697
    },
    {
      "worker A": "a1kaxclah6uvms",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.643
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1kaxclah6uvms",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.643
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.636
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.636
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 35,
      "cohen's kappa correlation": 0.635
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "apul86331somr",
      "number of common tasks": 35,
      "cohen's kappa correlation": 0.635
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.615
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1zq7a1cuv6rd8",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.615
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.6
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a3mwv912lnfd67",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.6
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1kaxclah6uvms",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.6
    },
    {
      "worker A": "a1kaxclah6uvms",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.6
    },
    {
      "worker A": "maria",
      "worker B": "atiqnur",
      "number of common tasks": 92,
      "cohen's kappa correlation": 0.594
    },
    {
      "worker A": "atiqnur",
      "worker B": "maria",
      "number of common tasks": 92,
      "cohen's kappa correlation": 0.594
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.556
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.556
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "arb4paabfrza4",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.556
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "arb4paabfrza4",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.556
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 19,
      "cohen's kappa correlation": 0.55
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2tmsm19ycexle",
      "number of common tasks": 19,
      "cohen's kappa correlation": 0.55
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 28,
      "cohen's kappa correlation": 0.547
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "atiqnur",
      "number of common tasks": 28,
      "cohen's kappa correlation": 0.547
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.531
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.531
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.531
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.531
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 39,
      "cohen's kappa correlation": 0.528
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 39,
      "cohen's kappa correlation": 0.528
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.524
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.524
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 171,
      "cohen's kappa correlation": 0.507
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 171,
      "cohen's kappa correlation": 0.507
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "maria",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0.5
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0.5
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.5
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "arb4paabfrza4",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0.5
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0.5
    },
    {
      "worker A": "maria",
      "worker B": "a34m93njc830dp",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0.5
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0.5
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3mwv912lnfd67",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0.5
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "maria",
      "number of common tasks": 14,
      "cohen's kappa correlation": 0.495
    },
    {
      "worker A": "maria",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 14,
      "cohen's kappa correlation": 0.495
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a2tmsm19ycexle",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.492
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.492
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.464
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.464
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.459
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.459
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 100,
      "cohen's kappa correlation": 0.459
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 100,
      "cohen's kappa correlation": 0.459
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 78,
      "cohen's kappa correlation": 0.459
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "apul86331somr",
      "number of common tasks": 78,
      "cohen's kappa correlation": 0.459
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 92,
      "cohen's kappa correlation": 0.458
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 92,
      "cohen's kappa correlation": 0.458
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.455
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.455
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 128,
      "cohen's kappa correlation": 0.443
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 128,
      "cohen's kappa correlation": 0.443
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "maria",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0.441
    },
    {
      "worker A": "maria",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0.441
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 32,
      "cohen's kappa correlation": 0.438
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 32,
      "cohen's kappa correlation": 0.438
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 132,
      "cohen's kappa correlation": 0.429
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1zq7a1cuv6rd8",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.429
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 132,
      "cohen's kappa correlation": 0.429
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.429
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "apul86331somr",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.424
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.424
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "apul86331somr",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.417
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.417
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "apul86331somr",
      "number of common tasks": 589,
      "cohen's kappa correlation": 0.416
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 589,
      "cohen's kappa correlation": 0.416
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.412
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.412
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 2332,
      "cohen's kappa correlation": 0.404
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 2332,
      "cohen's kappa correlation": 0.404
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2wnw8a4mor7t7",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0.4
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0.4
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.398
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.398
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.388
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.388
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 431,
      "cohen's kappa correlation": 0.37
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 431,
      "cohen's kappa correlation": 0.37
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 835,
      "cohen's kappa correlation": 0.36
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 835,
      "cohen's kappa correlation": 0.36
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 19,
      "cohen's kappa correlation": 0.356
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a34m93njc830dp",
      "number of common tasks": 19,
      "cohen's kappa correlation": 0.356
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 22,
      "cohen's kappa correlation": 0.347
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 22,
      "cohen's kappa correlation": 0.347
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0.333
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0.333
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3qief1hbf69y4",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0.333
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a15qfi76w7p5f0",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0.333
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3qief1hbf69y4",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0.333
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0.333
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 264,
      "cohen's kappa correlation": 0.332
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 264,
      "cohen's kappa correlation": 0.332
    },
    {
      "worker A": "maria",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 22,
      "cohen's kappa correlation": 0.331
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "maria",
      "number of common tasks": 22,
      "cohen's kappa correlation": 0.331
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 69,
      "cohen's kappa correlation": 0.329
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 69,
      "cohen's kappa correlation": 0.329
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 240,
      "cohen's kappa correlation": 0.322
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 240,
      "cohen's kappa correlation": 0.322
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 2028,
      "cohen's kappa correlation": 0.31
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 2028,
      "cohen's kappa correlation": 0.31
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 63,
      "cohen's kappa correlation": 0.309
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 63,
      "cohen's kappa correlation": 0.309
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2ybgz2h2kso5t",
      "number of common tasks": 18,
      "cohen's kappa correlation": 0.308
    },
    {
      "worker A": "a2ybgz2h2kso5t",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 18,
      "cohen's kappa correlation": 0.308
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 40,
      "cohen's kappa correlation": 0.305
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 40,
      "cohen's kappa correlation": 0.305
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.3
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3546x291kz1pv",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.3
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.296
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.296
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0.286
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a2tmsm19ycexle",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0.286
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "maria",
      "number of common tasks": 140,
      "cohen's kappa correlation": 0.272
    },
    {
      "worker A": "maria",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 140,
      "cohen's kappa correlation": 0.272
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 49,
      "cohen's kappa correlation": 0.266
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 49,
      "cohen's kappa correlation": 0.266
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 152,
      "cohen's kappa correlation": 0.265
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 152,
      "cohen's kappa correlation": 0.265
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.254
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "ac6pi4sad0n05",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.254
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 30,
      "cohen's kappa correlation": 0.251
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 30,
      "cohen's kappa correlation": 0.251
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "apul86331somr",
      "number of common tasks": 6,
      "cohen's kappa correlation": 0.25
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "atiqnur",
      "number of common tasks": 6,
      "cohen's kappa correlation": 0.25
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0.25
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0.25
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a15qfi76w7p5f0",
      "number of common tasks": 6,
      "cohen's kappa correlation": 0.25
    },
    {
      "worker A": "atiqnur",
      "worker B": "a34m93njc830dp",
      "number of common tasks": 6,
      "cohen's kappa correlation": 0.25
    },
    {
      "worker A": "atiqnur",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 129,
      "cohen's kappa correlation": 0.241
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "atiqnur",
      "number of common tasks": 129,
      "cohen's kappa correlation": 0.241
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 25,
      "cohen's kappa correlation": 0.235
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 25,
      "cohen's kappa correlation": 0.235
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 194,
      "cohen's kappa correlation": 0.232
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 194,
      "cohen's kappa correlation": 0.232
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "maria",
      "number of common tasks": 63,
      "cohen's kappa correlation": 0.213
    },
    {
      "worker A": "maria",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 63,
      "cohen's kappa correlation": 0.213
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 22,
      "cohen's kappa correlation": 0.204
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "atiqnur",
      "number of common tasks": 22,
      "cohen's kappa correlation": 0.204
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a1ngxqmobcxdc3",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.2
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.2
    },
    {
      "worker A": "atiqnur",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 90,
      "cohen's kappa correlation": 0.196
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "atiqnur",
      "number of common tasks": 90,
      "cohen's kappa correlation": 0.196
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "apul86331somr",
      "number of common tasks": 379,
      "cohen's kappa correlation": 0.194
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 379,
      "cohen's kappa correlation": 0.194
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.18
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "ac6pi4sad0n05",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.18
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1kaxclah6uvms",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0.175
    },
    {
      "worker A": "a1kaxclah6uvms",
      "worker B": "apul86331somr",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0.175
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 278,
      "cohen's kappa correlation": 0.174
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "atiqnur",
      "number of common tasks": 278,
      "cohen's kappa correlation": 0.174
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3mwv912lnfd67",
      "number of common tasks": 8,
      "cohen's kappa correlation": 0.167
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 8,
      "cohen's kappa correlation": 0.167
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 8,
      "cohen's kappa correlation": 0.167
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0.167
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 8,
      "cohen's kappa correlation": 0.167
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0.167
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "apul86331somr",
      "number of common tasks": 1408,
      "cohen's kappa correlation": 0.16
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 1408,
      "cohen's kappa correlation": 0.16
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 72,
      "cohen's kappa correlation": 0.155
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 72,
      "cohen's kappa correlation": 0.155
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 28,
      "cohen's kappa correlation": 0.144
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 28,
      "cohen's kappa correlation": 0.144
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 32,
      "cohen's kappa correlation": 0.135
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 32,
      "cohen's kappa correlation": 0.135
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 13,
      "cohen's kappa correlation": 0.133
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 13,
      "cohen's kappa correlation": 0.133
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.125
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a15qfi76w7p5f0",
      "number of common tasks": 20,
      "cohen's kappa correlation": 0.125
    },
    {
      "worker A": "atiqnur",
      "worker B": "apul86331somr",
      "number of common tasks": 71,
      "cohen's kappa correlation": 0.125
    },
    {
      "worker A": "apul86331somr",
      "worker B": "atiqnur",
      "number of common tasks": 71,
      "cohen's kappa correlation": 0.125
    },
    {
      "worker A": "apul86331somr",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 9,
      "cohen's kappa correlation": 0.1
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "apul86331somr",
      "number of common tasks": 9,
      "cohen's kappa correlation": 0.1
    },
    {
      "worker A": "maria",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.097
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "maria",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.097
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 167,
      "cohen's kappa correlation": 0.09
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 167,
      "cohen's kappa correlation": 0.09
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.079
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a15qfi76w7p5f0",
      "number of common tasks": 7,
      "cohen's kappa correlation": 0.079
    },
    {
      "worker A": "apul86331somr",
      "worker B": "maria",
      "number of common tasks": 42,
      "cohen's kappa correlation": 0.075
    },
    {
      "worker A": "maria",
      "worker B": "apul86331somr",
      "number of common tasks": 42,
      "cohen's kappa correlation": 0.075
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 21,
      "cohen's kappa correlation": 0.061
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 21,
      "cohen's kappa correlation": 0.061
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "apul86331somr",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0.057
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0.057
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.054
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.054
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 13,
      "cohen's kappa correlation": 0.051
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "apul86331somr",
      "number of common tasks": 13,
      "cohen's kappa correlation": 0.051
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 533,
      "cohen's kappa correlation": 0.045
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 533,
      "cohen's kappa correlation": 0.045
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 8,
      "cohen's kappa correlation": 0.04
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 8,
      "cohen's kappa correlation": 0.04
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3il7zprl8su05",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.038
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.038
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.038
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a16aksclsvcw9a",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0.038
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 30,
      "cohen's kappa correlation": 0.026
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 30,
      "cohen's kappa correlation": 0.026
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "apul86331somr",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "atiqnur",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "maria",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "apul86331somr",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "maria",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 12,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a15qfi76w7p5f0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a34m93njc830dp",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a1vksxdk4qaef9",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "apul86331somr",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "azniefuivb2h0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "atiqnur",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "maria",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "apul86331somr",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a16aksclsvcw9a",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a1ngxqmobcxdc3",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a16aksclsvcw9a",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a3546x291kz1pv",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a15qfi76w7p5f0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "atiqnur",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "atiqnur",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "maria",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3il7zprl8su05",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "maria",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 9,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "apul86331somr",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "atiqnur",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a22crwmzux7ffr",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "azniefuivb2h0",
      "worker B": "apul86331somr",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a22crwmzux7ffr",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a22crwmzux7ffr",
      "worker B": "apul86331somr",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a24n92d5wypbbz",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a24n92d5wypbbz",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a24n92d5wypbbz",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a2wnw8a4mor7t7",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a24n92d5wypbbz",
      "worker B": "apul86331somr",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1vksxdk4qaef9",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a292qslc0but0o",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1xifpi36695gyy",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a292qslc0but0o",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a292qslc0but0o",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a24n92d5wypbbz",
      "number of common tasks": 10,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a292qslc0but0o",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2gm2vil6j238n",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a292qslc0but0o",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gm2vil6j238n",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gm2vil6j238n",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gm2vil6j238n",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gm2vil6j238n",
      "worker B": "aj74bnwtcx0mj",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a15qfi76w7p5f0",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a16aksclsvcw9a",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a3qief1hbf69y4",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1zq7a1cuv6rd8",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1xifpi36695gyy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1vksxdk4qaef9",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a1vksxdk4qaef9",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "azniefuivb2h0",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3gxshlbnd9e92",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1xifpi36695gyy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1zq7a1cuv6rd8",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a22crwmzux7ffr",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a24n92d5wypbbz",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a2gm2vil6j238n",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "awraxv1riyr0m",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "azniefuivb2h0",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a3546x291kz1pv",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a2wnw8a4mor7t7",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a347bikldruuxm",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "awraxv1riyr0m",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a3qief1hbf69y4",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3546x291kz1pv",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "maria",
      "worker B": "a1zq7a1cuv6rd8",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a15qfi76w7p5f0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3gxshlbnd9e92",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3il7zprl8su05",
      "number of common tasks": 9,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a292qslc0but0o",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a2gm2vil6j238n",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3mwv912lnfd67",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "maria",
      "worker B": "a1xifpi36695gyy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "azniefuivb2h0",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "apul86331somr",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "atiqnur",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "azniefuivb2h0",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "ac6pi4sad0n05",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "maria",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 4,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "awraxv1riyr0m",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "apul86331somr",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "apul86331somr",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a3gxshlbnd9e92",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a2wnw8a4mor7t7",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a347bikldruuxm",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 6,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 11,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a3rlcgrxa34gc0",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "apul86331somr",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "arb4paabfrza4",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1vksxdk4qaef9",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a22crwmzux7ffr",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a292qslc0but0o",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a2gm2vil6j238n",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a1vksxdk4qaef9",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1xifpi36695gyy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a24n92d5wypbbz",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a2wnw8a4mor7t7",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 6,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a16aksclsvcw9a",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "a3mwv912lnfd67",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a34m93njc830dp",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "maria",
      "number of common tasks": 12,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1ngxqmobcxdc3",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3il7zprl8su05",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1vksxdk4qaef9",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a1hdze291yubo5",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a22crwmzux7ffr",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a24n92d5wypbbz",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2tmsm19ycexle",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2wnw8a4mor7t7",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a323ww03vm8089",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a292qslc0but0o",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3546x291kz1pv",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "apul86331somr",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3il7zprl8su05",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "atiqnur",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 5,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "maria",
      "worker B": "a2wnw8a4mor7t7",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "awraxv1riyr0m",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "awraxv1riyr0m",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "azniefuivb2h0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "azniefuivb2h0",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1vksxdk4qaef9",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a16aksclsvcw9a",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 3,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "apul86331somr",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a1ngxqmobcxdc3",
      "number of common tasks": 2,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "a1sba5axpqhien",
      "number of common tasks": 1,
      "cohen's kappa correlation": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 19,
      "cohen's kappa correlation": -0.005
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "atiqnur",
      "number of common tasks": 19,
      "cohen's kappa correlation": -0.005
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 11,
      "cohen's kappa correlation": -0.031
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "atiqnur",
      "number of common tasks": 11,
      "cohen's kappa correlation": -0.031
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 38,
      "cohen's kappa correlation": -0.049
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3gludqzgejl5g",
      "number of common tasks": 38,
      "cohen's kappa correlation": -0.049
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "ai45ndjpuioej",
      "number of common tasks": 57,
      "cohen's kappa correlation": -0.058
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 57,
      "cohen's kappa correlation": -0.058
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a16aksclsvcw9a",
      "number of common tasks": 7,
      "cohen's kappa correlation": -0.094
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a1ngxqmobcxdc3",
      "number of common tasks": 7,
      "cohen's kappa correlation": -0.094
    },
    {
      "worker A": "maria",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 10,
      "cohen's kappa correlation": -0.111
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2ybgz2h2kso5t",
      "number of common tasks": 5,
      "cohen's kappa correlation": -0.111
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "maria",
      "number of common tasks": 10,
      "cohen's kappa correlation": -0.111
    },
    {
      "worker A": "a2ybgz2h2kso5t",
      "worker B": "apul86331somr",
      "number of common tasks": 5,
      "cohen's kappa correlation": -0.111
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 13,
      "cohen's kappa correlation": -0.114
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1ngxqmobcxdc3",
      "number of common tasks": 13,
      "cohen's kappa correlation": -0.114
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 9,
      "cohen's kappa correlation": -0.125
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 9,
      "cohen's kappa correlation": -0.125
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "atiqnur",
      "number of common tasks": 13,
      "cohen's kappa correlation": -0.13
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 13,
      "cohen's kappa correlation": -0.13
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "arx0s1cidjlox",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.143
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.143
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a182jw8u6po60u",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.143
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "apul86331somr",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.143
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 19,
      "cohen's kappa correlation": -0.193
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3il7zprl8su05",
      "number of common tasks": 19,
      "cohen's kappa correlation": -0.193
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "atiqnur",
      "number of common tasks": 7,
      "cohen's kappa correlation": -0.207
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3ux2fxa3nmjcs",
      "number of common tasks": 7,
      "cohen's kappa correlation": -0.207
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 14,
      "cohen's kappa correlation": -0.213
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3546x291kz1pv",
      "number of common tasks": 14,
      "cohen's kappa correlation": -0.213
    },
    {
      "worker A": "a22crwmzux7ffr",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 6,
      "cohen's kappa correlation": -0.25
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a22crwmzux7ffr",
      "number of common tasks": 6,
      "cohen's kappa correlation": -0.25
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3qief1hbf69y4",
      "number of common tasks": 6,
      "cohen's kappa correlation": -0.25
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 6,
      "cohen's kappa correlation": -0.25
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 11,
      "cohen's kappa correlation": -0.253
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 11,
      "cohen's kappa correlation": -0.253
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 8,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 8,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "a2ufd1i8zo1v4g",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a347bikldruuxm",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a347bikldruuxm",
      "number of common tasks": 8,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a2gng3wn85say6",
      "number of common tasks": 2,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1e6rs45guafc3",
      "number of common tasks": 2,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "atiqnur",
      "number of common tasks": 2,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "ac6pi4sad0n05",
      "number of common tasks": 8,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1ngxqmobcxdc3",
      "number of common tasks": 2,
      "cohen's kappa correlation": -0.333
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a1xifpi36695gy",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.455
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a2wnw8a4mor7t7",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.455
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "atiqnur",
      "number of common tasks": 3,
      "cohen's kappa correlation": -0.5
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3gxshlbnd9e92",
      "number of common tasks": 6,
      "cohen's kappa correlation": -0.5
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "maria",
      "number of common tasks": 3,
      "cohen's kappa correlation": -0.5
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "worker B": "a3kvu2c809dok5",
      "number of common tasks": 6,
      "cohen's kappa correlation": -0.5
    },
    {
      "worker A": "maria",
      "worker B": "a1aq2yedwrxb2e",
      "number of common tasks": 3,
      "cohen's kappa correlation": -0.5
    },
    {
      "worker A": "atiqnur",
      "worker B": "a2tmsm19ycexle",
      "number of common tasks": 3,
      "cohen's kappa correlation": -0.5
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a347bikldruuxm",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.6
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "apul86331somr",
      "number of common tasks": 4,
      "cohen's kappa correlation": -0.6
    }
];
var cohen = cohen2.sort( (a,b) => 
a["cohen's kappa correlation"]<b["cohen's kappa correlation"]? 1 : a["cohen's kappa correlation"]>b["cohen's kappa correlation"]? -1 : 0)
/*a["worker A"]<b["worker A"]? 1 :
  (a["worker A"]>b["worker A"]? -1 :
  (a["worker A"]==b["worker A"]? 
    (a["worker B"]<b["worker B"]? 1 :
    a["worker B"]>b["worker B"]? -1 : 0) : 
  0 ))
)*/
const m1 =
[
    {
      "worker A": "apul86331somr",
      "worker B": "a3mwv912lnfd67",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 1
    },
    {
      "worker A": "a2ybgz2h2kso5t",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 10,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 1
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "arb4paabfrza4",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 8,
      "number of different given labels": 3,
      "number of common tasks": 8,
      "m1": 1
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a34m93njc830dp",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 10,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 1
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "ac6pi4sad0n05",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 1
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 10,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 1
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 1
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 1
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a2ybgz2h2kso5t",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 10,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 1
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 1
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 8,
      "number of different given labels": 3,
      "number of common tasks": 8,
      "m1": 1
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1zq7a1cuv6rd8",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 1
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a16aksclsvcw9a",
      "both voted wrong but different answer": 1,
      "just one voted right": 1,
      "times they voted the same": 17,
      "number of different given labels": 2,
      "number of common tasks": 19,
      "m1": 0.921
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 1,
      "just one voted right": 1,
      "times they voted the same": 17,
      "number of different given labels": 2,
      "number of common tasks": 19,
      "m1": 0.921
    },
    {
      "worker A": "maria",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 11,
      "number of different given labels": 2,
      "number of common tasks": 12,
      "m1": 0.917
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 29,
      "number of different given labels": 3,
      "number of common tasks": 32,
      "m1": 0.906
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 29,
      "number of different given labels": 3,
      "number of common tasks": 32,
      "m1": 0.906
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 18,
      "number of different given labels": 2,
      "number of common tasks": 20,
      "m1": 0.9
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a24n92d5wypbbz",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 9,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 0.9
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1zq7a1cuv6rd8",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 18,
      "number of different given labels": 2,
      "number of common tasks": 20,
      "m1": 0.9
    },
    {
      "worker A": "apul86331somr",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 17,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.895
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 17,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.895
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 30,
      "number of different given labels": 3,
      "number of common tasks": 34,
      "m1": 0.882
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 30,
      "number of different given labels": 3,
      "number of common tasks": 34,
      "m1": 0.882
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 1,
      "just one voted right": 0,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.875
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 1,
      "just one voted right": 0,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 4,
      "m1": 0.875
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 1,
      "just one voted right": 0,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 4,
      "m1": 0.875
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3mwv912lnfd67",
      "both voted wrong but different answer": 1,
      "just one voted right": 0,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.875
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 6,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.857
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a34m93njc830dp",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 6,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.857
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 6,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.857
    },
    {
      "worker A": "apul86331somr",
      "worker B": "ac6pi4sad0n05",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 6,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.857
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 17,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.85
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 17,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.85
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 29,
      "number of different given labels": 3,
      "number of common tasks": 35,
      "m1": 0.829
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 29,
      "number of different given labels": 3,
      "number of common tasks": 35,
      "m1": 0.829
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 8,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 0.8
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1kaxclah6uvms",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 16,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.8
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 8,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.8
    },
    {
      "worker A": "a1kaxclah6uvms",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 16,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.8
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 8,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.8
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1zq7a1cuv6rd8",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 8,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.8
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 130,
      "times they voted the same": 459,
      "number of different given labels": 3,
      "number of common tasks": 589,
      "m1": 0.779
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 130,
      "times they voted the same": 459,
      "number of different given labels": 3,
      "number of common tasks": 589,
      "m1": 0.779
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "maria",
      "both voted wrong but different answer": 1,
      "just one voted right": 2,
      "times they voted the same": 8,
      "number of different given labels": 2,
      "number of common tasks": 11,
      "m1": 0.773
    },
    {
      "worker A": "maria",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 1,
      "just one voted right": 2,
      "times they voted the same": 8,
      "number of different given labels": 3,
      "number of common tasks": 11,
      "m1": 0.773
    },
    {
      "worker A": "atiqnur",
      "worker B": "maria",
      "both voted wrong but different answer": 1,
      "just one voted right": 22,
      "times they voted the same": 69,
      "number of different given labels": 3,
      "number of common tasks": 92,
      "m1": 0.755
    },
    {
      "worker A": "maria",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 1,
      "just one voted right": 22,
      "times they voted the same": 69,
      "number of different given labels": 3,
      "number of common tasks": 92,
      "m1": 0.755
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 15,
      "number of different given labels": 2,
      "number of common tasks": 20,
      "m1": 0.75
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "arb4paabfrza4",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "maria",
      "both voted wrong but different answer": 1,
      "just one voted right": 3,
      "times they voted the same": 10,
      "number of different given labels": 3,
      "number of common tasks": 14,
      "m1": 0.75
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 15,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.75
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 21,
      "number of different given labels": 3,
      "number of common tasks": 28,
      "m1": 0.75
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 1,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.75
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 1,
      "just one voted right": 2,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.75
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 1,
      "just one voted right": 2,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.75
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1zq7a1cuv6rd8",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 1,
      "just one voted right": 2,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.75
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 21,
      "number of different given labels": 3,
      "number of common tasks": 28,
      "m1": 0.75
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 8,
      "times they voted the same": 24,
      "number of different given labels": 3,
      "number of common tasks": 32,
      "m1": 0.75
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "arb4paabfrza4",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a1kaxclah6uvms",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 8,
      "times they voted the same": 24,
      "number of different given labels": 3,
      "number of common tasks": 32,
      "m1": 0.75
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 23,
      "times they voted the same": 69,
      "number of different given labels": 3,
      "number of common tasks": 92,
      "m1": 0.75
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a3mwv912lnfd67",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 23,
      "times they voted the same": 69,
      "number of different given labels": 3,
      "number of common tasks": 92,
      "m1": 0.75
    },
    {
      "worker A": "maria",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 1,
      "just one voted right": 3,
      "times they voted the same": 10,
      "number of different given labels": 3,
      "number of common tasks": 14,
      "m1": 0.75
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 1,
      "just one voted right": 2,
      "times they voted the same": 7,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 0.75
    },
    {
      "worker A": "maria",
      "worker B": "a1zq7a1cuv6rd8",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1kaxclah6uvms",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.75
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 0,
      "just one voted right": 10,
      "times they voted the same": 29,
      "number of different given labels": 3,
      "number of common tasks": 39,
      "m1": 0.744
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 10,
      "times they voted the same": 29,
      "number of different given labels": 3,
      "number of common tasks": 39,
      "m1": 0.744
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 44,
      "times they voted the same": 127,
      "number of different given labels": 3,
      "number of common tasks": 171,
      "m1": 0.743
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 44,
      "times they voted the same": 127,
      "number of different given labels": 3,
      "number of common tasks": 171,
      "m1": 0.743
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 1,
      "just one voted right": 217,
      "times they voted the same": 617,
      "number of different given labels": 3,
      "number of common tasks": 835,
      "m1": 0.74
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 1,
      "just one voted right": 217,
      "times they voted the same": 617,
      "number of different given labels": 3,
      "number of common tasks": 835,
      "m1": 0.74
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 14,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.737
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2tmsm19ycexle",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 14,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.737
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 27,
      "times they voted the same": 73,
      "number of different given labels": 3,
      "number of common tasks": 100,
      "m1": 0.73
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 27,
      "times they voted the same": 73,
      "number of different given labels": 3,
      "number of common tasks": 100,
      "m1": 0.73
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 1,
      "just one voted right": 5,
      "times they voted the same": 14,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.725
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 1,
      "just one voted right": 5,
      "times they voted the same": 14,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.725
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 9,
      "times they voted the same": 23,
      "number of different given labels": 3,
      "number of common tasks": 32,
      "m1": 0.719
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 9,
      "times they voted the same": 23,
      "number of different given labels": 3,
      "number of common tasks": 32,
      "m1": 0.719
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 71,
      "times they voted the same": 169,
      "number of different given labels": 3,
      "number of common tasks": 240,
      "m1": 0.704
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 71,
      "times they voted the same": 169,
      "number of different given labels": 3,
      "number of common tasks": 240,
      "m1": 0.704
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 14,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.7
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "maria",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a2tmsm19ycexle",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.7
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 14,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.7
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 1,
      "just one voted right": 23,
      "times they voted the same": 54,
      "number of different given labels": 3,
      "number of common tasks": 78,
      "m1": 0.699
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 1,
      "just one voted right": 23,
      "times they voted the same": 54,
      "number of different given labels": 3,
      "number of common tasks": 78,
      "m1": 0.699
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 5,
      "just one voted right": 714,
      "times they voted the same": 1613,
      "number of different given labels": 3,
      "number of common tasks": 2332,
      "m1": 0.693
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 5,
      "just one voted right": 714,
      "times they voted the same": 1613,
      "number of different given labels": 3,
      "number of common tasks": 2332,
      "m1": 0.693
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 9,
      "number of different given labels": 2,
      "number of common tasks": 13,
      "m1": 0.692
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 9,
      "number of different given labels": 3,
      "number of common tasks": 13,
      "m1": 0.692
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 40,
      "times they voted the same": 88,
      "number of different given labels": 3,
      "number of common tasks": 128,
      "m1": 0.688
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 40,
      "times they voted the same": 88,
      "number of different given labels": 3,
      "number of common tasks": 128,
      "m1": 0.688
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 2,
      "just one voted right": 118,
      "times they voted the same": 259,
      "number of different given labels": 3,
      "number of common tasks": 379,
      "m1": 0.686
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 2,
      "just one voted right": 118,
      "times they voted the same": 259,
      "number of different given labels": 3,
      "number of common tasks": 379,
      "m1": 0.686
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 3,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 10,
      "times they voted the same": 20,
      "number of different given labels": 3,
      "number of common tasks": 30,
      "m1": 0.667
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 2,
      "just one voted right": 20,
      "times they voted the same": 41,
      "number of different given labels": 3,
      "number of common tasks": 63,
      "m1": 0.667
    },
    {
      "worker A": "a22crwmzux7ffr",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "maria",
      "worker B": "a34m93njc830dp",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 3,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 3,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a22crwmzux7ffr",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1vksxdk4qaef9",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "arb4paabfrza4",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 2,
      "just one voted right": 20,
      "times they voted the same": 41,
      "number of different given labels": 3,
      "number of common tasks": 63,
      "m1": 0.667
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 6,
      "number of different given labels": 3,
      "number of common tasks": 9,
      "m1": 0.667
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2wnw8a4mor7t7",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 6,
      "number of different given labels": 2,
      "number of common tasks": 9,
      "m1": 0.667
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 10,
      "times they voted the same": 20,
      "number of different given labels": 3,
      "number of common tasks": 30,
      "m1": 0.667
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.667
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 1,
      "just one voted right": 57,
      "times they voted the same": 109,
      "number of different given labels": 3,
      "number of common tasks": 167,
      "m1": 0.656
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 1,
      "just one voted right": 57,
      "times they voted the same": 109,
      "number of different given labels": 2,
      "number of common tasks": 167,
      "m1": 0.656
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 14,
      "times they voted the same": 26,
      "number of different given labels": 3,
      "number of common tasks": 40,
      "m1": 0.65
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 13,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.65
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 13,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.65
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 14,
      "times they voted the same": 26,
      "number of different given labels": 3,
      "number of common tasks": 40,
      "m1": 0.65
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 47,
      "times they voted the same": 85,
      "number of different given labels": 3,
      "number of common tasks": 132,
      "m1": 0.644
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 47,
      "times they voted the same": 85,
      "number of different given labels": 3,
      "number of common tasks": 132,
      "m1": 0.644
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 1,
      "just one voted right": 17,
      "times they voted the same": 31,
      "number of different given labels": 3,
      "number of common tasks": 49,
      "m1": 0.643
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 1,
      "just one voted right": 17,
      "times they voted the same": 31,
      "number of different given labels": 2,
      "number of common tasks": 49,
      "m1": 0.643
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 8,
      "just one voted right": 741,
      "times they voted the same": 1279,
      "number of different given labels": 3,
      "number of common tasks": 2028,
      "m1": 0.633
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 8,
      "just one voted right": 741,
      "times they voted the same": 1279,
      "number of different given labels": 3,
      "number of common tasks": 2028,
      "m1": 0.633
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 2,
      "just one voted right": 25,
      "times they voted the same": 42,
      "number of different given labels": 3,
      "number of common tasks": 69,
      "m1": 0.623
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 2,
      "just one voted right": 25,
      "times they voted the same": 42,
      "number of different given labels": 3,
      "number of common tasks": 69,
      "m1": 0.623
    },
    {
      "worker A": "maria",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 53,
      "times they voted the same": 87,
      "number of different given labels": 3,
      "number of common tasks": 140,
      "m1": 0.621
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 53,
      "times they voted the same": 87,
      "number of different given labels": 3,
      "number of common tasks": 140,
      "m1": 0.621
    },
    {
      "worker A": "maria",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 24,
      "times they voted the same": 39,
      "number of different given labels": 3,
      "number of common tasks": 63,
      "m1": 0.619
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 24,
      "times they voted the same": 39,
      "number of different given labels": 3,
      "number of common tasks": 63,
      "m1": 0.619
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 1,
      "just one voted right": 101,
      "times they voted the same": 162,
      "number of different given labels": 3,
      "number of common tasks": 264,
      "m1": 0.616
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 1,
      "just one voted right": 101,
      "times they voted the same": 162,
      "number of different given labels": 3,
      "number of common tasks": 264,
      "m1": 0.616
    },
    {
      "worker A": "a2ybgz2h2kso5t",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 11,
      "number of different given labels": 2,
      "number of common tasks": 18,
      "m1": 0.611
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2ybgz2h2kso5t",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 11,
      "number of different given labels": 2,
      "number of common tasks": 18,
      "m1": 0.611
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 3,
      "just one voted right": 170,
      "times they voted the same": 258,
      "number of different given labels": 3,
      "number of common tasks": 431,
      "m1": 0.602
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 3,
      "just one voted right": 170,
      "times they voted the same": 258,
      "number of different given labels": 3,
      "number of common tasks": 431,
      "m1": 0.602
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 6,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.6
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 6,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.6
    },
    {
      "worker A": "a2ybgz2h2kso5t",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 5,
      "m1": 0.6
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a24n92d5wypbbz",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 5,
      "m1": 0.6
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 5,
      "m1": 0.6
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a2tmsm19ycexle",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 5,
      "m1": 0.6
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2ybgz2h2kso5t",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 5,
      "m1": 0.6
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 9,
      "times they voted the same": 13,
      "number of different given labels": 3,
      "number of common tasks": 22,
      "m1": 0.591
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 9,
      "times they voted the same": 13,
      "number of different given labels": 3,
      "number of common tasks": 22,
      "m1": 0.591
    },
    {
      "worker A": "maria",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 9,
      "times they voted the same": 13,
      "number of different given labels": 3,
      "number of common tasks": 22,
      "m1": 0.591
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 0,
      "just one voted right": 9,
      "times they voted the same": 13,
      "number of different given labels": 2,
      "number of common tasks": 22,
      "m1": 0.591
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a34m93njc830dp",
      "both voted wrong but different answer": 0,
      "just one voted right": 8,
      "times they voted the same": 11,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.579
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 8,
      "times they voted the same": 11,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.579
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 1,
      "just one voted right": 54,
      "times they voted the same": 74,
      "number of different given labels": 3,
      "number of common tasks": 129,
      "m1": 0.578
    },
    {
      "worker A": "atiqnur",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 1,
      "just one voted right": 54,
      "times they voted the same": 74,
      "number of different given labels": 3,
      "number of common tasks": 129,
      "m1": 0.578
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 1,
      "just one voted right": 5,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 13,
      "m1": 0.577
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 1,
      "just one voted right": 5,
      "times they voted the same": 7,
      "number of different given labels": 3,
      "number of common tasks": 13,
      "m1": 0.577
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "maria",
      "both voted wrong but different answer": 2,
      "just one voted right": 2,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 7,
      "m1": 0.571
    },
    {
      "worker A": "maria",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 2,
      "just one voted right": 2,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 7,
      "m1": 0.571
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 4,
      "just one voted right": 613,
      "times they voted the same": 791,
      "number of different given labels": 3,
      "number of common tasks": 1408,
      "m1": 0.563
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 4,
      "just one voted right": 613,
      "times they voted the same": 791,
      "number of different given labels": 3,
      "number of common tasks": 1408,
      "m1": 0.563
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 9,
      "m1": 0.556
    },
    {
      "worker A": "apul86331somr",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 9,
      "m1": 0.556
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 9,
      "just one voted right": 120,
      "times they voted the same": 149,
      "number of different given labels": 3,
      "number of common tasks": 278,
      "m1": 0.552
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 87,
      "times they voted the same": 107,
      "number of different given labels": 3,
      "number of common tasks": 194,
      "m1": 0.552
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 87,
      "times they voted the same": 107,
      "number of different given labels": 3,
      "number of common tasks": 194,
      "m1": 0.552
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 9,
      "just one voted right": 120,
      "times they voted the same": 149,
      "number of different given labels": 3,
      "number of common tasks": 278,
      "m1": 0.552
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 1,
      "just one voted right": 4,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.55
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 1,
      "just one voted right": 4,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.55
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 1,
      "just one voted right": 32,
      "times they voted the same": 39,
      "number of different given labels": 3,
      "number of common tasks": 72,
      "m1": 0.549
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 1,
      "just one voted right": 32,
      "times they voted the same": 39,
      "number of different given labels": 3,
      "number of common tasks": 72,
      "m1": 0.549
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 2,
      "just one voted right": 9,
      "times they voted the same": 11,
      "number of different given labels": 3,
      "number of common tasks": 22,
      "m1": 0.545
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 2,
      "just one voted right": 9,
      "times they voted the same": 11,
      "number of different given labels": 3,
      "number of common tasks": 22,
      "m1": 0.545
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 13,
      "times they voted the same": 15,
      "number of different given labels": 3,
      "number of common tasks": 28,
      "m1": 0.536
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 13,
      "times they voted the same": 15,
      "number of different given labels": 3,
      "number of common tasks": 28,
      "m1": 0.536
    },
    {
      "worker A": "atiqnur",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 33,
      "times they voted the same": 38,
      "number of different given labels": 3,
      "number of common tasks": 71,
      "m1": 0.535
    },
    {
      "worker A": "apul86331somr",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 33,
      "times they voted the same": 38,
      "number of different given labels": 2,
      "number of common tasks": 71,
      "m1": 0.535
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 2,
      "just one voted right": 70,
      "times they voted the same": 80,
      "number of different given labels": 3,
      "number of common tasks": 152,
      "m1": 0.533
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 14,
      "times they voted the same": 16,
      "number of different given labels": 3,
      "number of common tasks": 30,
      "m1": 0.533
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 0,
      "just one voted right": 14,
      "times they voted the same": 16,
      "number of different given labels": 3,
      "number of common tasks": 30,
      "m1": 0.533
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 2,
      "just one voted right": 70,
      "times they voted the same": 80,
      "number of different given labels": 3,
      "number of common tasks": 152,
      "m1": 0.533
    },
    {
      "worker A": "maria",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 20,
      "times they voted the same": 22,
      "number of different given labels": 3,
      "number of common tasks": 42,
      "m1": 0.524
    },
    {
      "worker A": "apul86331somr",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 20,
      "times they voted the same": 22,
      "number of different given labels": 2,
      "number of common tasks": 42,
      "m1": 0.524
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 2,
      "just one voted right": 42,
      "times they voted the same": 46,
      "number of different given labels": 3,
      "number of common tasks": 90,
      "m1": 0.522
    },
    {
      "worker A": "atiqnur",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 2,
      "just one voted right": 42,
      "times they voted the same": 46,
      "number of different given labels": 3,
      "number of common tasks": 90,
      "m1": 0.522
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 12,
      "times they voted the same": 13,
      "number of different given labels": 3,
      "number of common tasks": 25,
      "m1": 0.52
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 12,
      "times they voted the same": 13,
      "number of different given labels": 3,
      "number of common tasks": 25,
      "m1": 0.52
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 6,
      "m1": 0.5
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 5,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 0.5
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a347bikldruuxm",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 4,
      "number of different given labels": 2,
      "number of common tasks": 8,
      "m1": 0.5
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a2gm2vil6j238n",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.5
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3il7zprl8su05",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.5
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a347bikldruuxm",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.5
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1xifpi36695gyy",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 1,
      "just one voted right": 10,
      "times they voted the same": 10,
      "number of different given labels": 3,
      "number of common tasks": 21,
      "m1": 0.5
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3qief1hbf69y4",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.5
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3qief1hbf69y4",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a16aksclsvcw9a",
      "both voted wrong but different answer": 1,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.5
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "ac6pi4sad0n05",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.5
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "atiqnur",
      "worker B": "a34m93njc830dp",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 6,
      "m1": 0.5
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.5
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.5
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.5
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.5
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 6,
      "m1": 0.5
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "ac6pi4sad0n05",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.5
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 1,
      "just one voted right": 10,
      "times they voted the same": 10,
      "number of different given labels": 3,
      "number of common tasks": 21,
      "m1": 0.5
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.5
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.5
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a15qfi76w7p5f0",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 6,
      "m1": 0.5
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a16aksclsvcw9a",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 5,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 0.5
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 1,
      "just one voted right": 3,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.5
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.5
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a1ngxqmobcxdc3",
      "both voted wrong but different answer": 1,
      "just one voted right": 3,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 7,
      "m1": 0.5
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a15qfi76w7p5f0",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.5
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 6,
      "m1": 0.5
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 4,
      "number of different given labels": 2,
      "number of common tasks": 8,
      "m1": 0.5
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a347bikldruuxm",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0.5
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 11,
      "m1": 0.455
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1kaxclah6uvms",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 5,
      "number of different given labels": 2,
      "number of common tasks": 11,
      "m1": 0.455
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 11,
      "m1": 0.455
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 11,
      "m1": 0.455
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 11,
      "m1": 0.455
    },
    {
      "worker A": "a1kaxclah6uvms",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 11,
      "m1": 0.455
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 5,
      "number of different given labels": 2,
      "number of common tasks": 11,
      "m1": 0.455
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 6,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 11,
      "m1": 0.455
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3il7zprl8su05",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 4,
      "number of different given labels": 2,
      "number of common tasks": 9,
      "m1": 0.444
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 4,
      "number of different given labels": 3,
      "number of common tasks": 9,
      "m1": 0.444
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 1,
      "just one voted right": 4,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 8,
      "m1": 0.438
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3mwv912lnfd67",
      "both voted wrong but different answer": 1,
      "just one voted right": 4,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 8,
      "m1": 0.438
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 1,
      "just one voted right": 4,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 8,
      "m1": 0.438
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 1,
      "just one voted right": 4,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 8,
      "m1": 0.438
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.429
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3546x291kz1pv",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 7,
      "m1": 0.429
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 4,
      "just one voted right": 305,
      "times they voted the same": 224,
      "number of different given labels": 3,
      "number of common tasks": 533,
      "m1": 0.424
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 4,
      "just one voted right": 305,
      "times they voted the same": 224,
      "number of different given labels": 3,
      "number of common tasks": 533,
      "m1": 0.424
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 11,
      "times they voted the same": 8,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.421
    },
    {
      "worker A": "atiqnur",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 11,
      "times they voted the same": 8,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.421
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 34,
      "times they voted the same": 23,
      "number of different given labels": 2,
      "number of common tasks": 57,
      "m1": 0.404
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 34,
      "times they voted the same": 23,
      "number of different given labels": 3,
      "number of common tasks": 57,
      "m1": 0.404
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 5,
      "m1": 0.4
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 5,
      "m1": 0.4
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 2,
      "number of different given labels": 3,
      "number of common tasks": 5,
      "m1": 0.4
    },
    {
      "worker A": "maria",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 3,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.375
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 4,
      "number of different given labels": 2,
      "number of common tasks": 11,
      "m1": 0.364
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 3,
      "just one voted right": 23,
      "times they voted the same": 12,
      "number of different given labels": 3,
      "number of common tasks": 38,
      "m1": 0.355
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 3,
      "just one voted right": 23,
      "times they voted the same": 12,
      "number of different given labels": 3,
      "number of common tasks": 38,
      "m1": 0.355
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1ngxqmobcxdc3",
      "both voted wrong but different answer": 1,
      "just one voted right": 8,
      "times they voted the same": 4,
      "number of different given labels": 2,
      "number of common tasks": 13,
      "m1": 0.346
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 1,
      "just one voted right": 8,
      "times they voted the same": 4,
      "number of different given labels": 3,
      "number of common tasks": 13,
      "m1": 0.346
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "maria",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 3,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "atiqnur",
      "worker B": "a2tmsm19ycexle",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1vksxdk4qaef9",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 6,
      "m1": 0.333
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 3,
      "number of common tasks": 3,
      "m1": 0.333
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3gxshlbnd9e92",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 6,
      "m1": 0.333
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 1,
      "just one voted right": 5,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 8,
      "m1": 0.313
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 1,
      "just one voted right": 5,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 8,
      "m1": 0.313
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a15qfi76w7p5f0",
      "both voted wrong but different answer": 0,
      "just one voted right": 14,
      "times they voted the same": 6,
      "number of different given labels": 2,
      "number of common tasks": 20,
      "m1": 0.3
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 10,
      "m1": 0.3
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 10,
      "m1": 0.3
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 14,
      "times they voted the same": 6,
      "number of different given labels": 3,
      "number of common tasks": 20,
      "m1": 0.3
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a16aksclsvcw9a",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 2,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.286
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 2,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.286
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a15qfi76w7p5f0",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 7,
      "m1": 0.286
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 2,
      "number of different given labels": 3,
      "number of common tasks": 7,
      "m1": 0.286
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 7,
      "m1": 0.286
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a1ngxqmobcxdc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 7,
      "m1": 0.286
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 14,
      "times they voted the same": 5,
      "number of different given labels": 3,
      "number of common tasks": 19,
      "m1": 0.263
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3il7zprl8su05",
      "both voted wrong but different answer": 0,
      "just one voted right": 14,
      "times they voted the same": 5,
      "number of different given labels": 2,
      "number of common tasks": 19,
      "m1": 0.263
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 10,
      "times they voted the same": 3,
      "number of different given labels": 3,
      "number of common tasks": 13,
      "m1": 0.231
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 0,
      "just one voted right": 10,
      "times they voted the same": 3,
      "number of different given labels": 2,
      "number of common tasks": 13,
      "m1": 0.231
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a24n92d5wypbbz",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 5,
      "m1": 0.2
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 2,
      "just one voted right": 3,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 5,
      "m1": 0.2
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 9,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 11,
      "m1": 0.182
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 9,
      "times they voted the same": 2,
      "number of different given labels": 2,
      "number of common tasks": 11,
      "m1": 0.182
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3qief1hbf69y4",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 6,
      "m1": 0.167
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 1,
      "number of different given labels": 3,
      "number of common tasks": 6,
      "m1": 0.167
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a22crwmzux7ffr",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 6,
      "m1": 0.167
    },
    {
      "worker A": "a22crwmzux7ffr",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 6,
      "m1": 0.167
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 1,
      "number of different given labels": 3,
      "number of common tasks": 8,
      "m1": 0.125
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a2wnw8a4mor7t7",
      "both voted wrong but different answer": 1,
      "just one voted right": 3,
      "times they voted the same": 0,
      "number of different given labels": 3,
      "number of common tasks": 4,
      "m1": 0.125
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 1,
      "just one voted right": 3,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0.125
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "ac6pi4sad0n05",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 1,
      "number of different given labels": 3,
      "number of common tasks": 8,
      "m1": 0.125
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a3546x291kz1pv",
      "both voted wrong but different answer": 0,
      "just one voted right": 13,
      "times they voted the same": 1,
      "number of different given labels": 2,
      "number of common tasks": 14,
      "m1": 0.071
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 13,
      "times they voted the same": 1,
      "number of different given labels": 3,
      "number of common tasks": 14,
      "m1": 0.071
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1vksxdk4qaef9",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1xifpi36695gyy",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a3546x291kz1pv",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a24n92d5wypbbz",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 5,
      "m1": 0
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a2wnw8a4mor7t7",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a3qief1hbf69y4",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "awraxv1riyr0m",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "azniefuivb2h0",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a34m93njc830dp",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a3546x291kz1pv",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a3il7zprl8su05",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3mwv912lnfd67",
      "worker B": "awraxv1riyr0m",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3qief1hbf69y4",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a3qief1hbf69y4",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a15qfi76w7p5f0",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a292qslc0but0o",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "a2gm2vil6j238n",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gyy",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 4,
      "number of different given labels": 1,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "ac6pi4sad0n05",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "awraxv1riyr0m",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "azniefuivb2h0",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 1,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 3,
      "number of different given labels": 1,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "a22crwmzux7ffr",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "ac6pi4sad0n05",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "awraxv1riyr0m",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a24n92d5wypbbz",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 3,
      "number of different given labels": 1,
      "number of common tasks": 5,
      "m1": 0
    },
    {
      "worker A": "a24n92d5wypbbz",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 5,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 5,
      "m1": 0
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a15qfi76w7p5f0",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a24n92d5wypbbz",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 9,
      "number of different given labels": 1,
      "number of common tasks": 10,
      "m1": 0
    },
    {
      "worker A": "a24n92d5wypbbz",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 5,
      "m1": 0
    },
    {
      "worker A": "a292qslc0but0o",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a292qslc0but0o",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a292qslc0but0o",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "a3ux2fxa3nmjcs",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a323ww03vm8089",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "ai45ndjpuioej",
      "worker B": "arb4paabfrza4",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a292qslc0but0o",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a22crwmzux7ffr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a292qslc0but0o",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "worker B": "a2gm2vil6j238n",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a2gm2vil6j238n",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gm2vil6j238n",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a34m93njc830dp",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gm2vil6j238n",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a16aksclsvcw9a",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gm2vil6j238n",
      "worker B": "aj74bnwtcx0mj",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a15qfi76w7p5f0",
      "both voted wrong but different answer": 1,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "a3gludqzgejl5g",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1ngxqmobcxdc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a1vksxdk4qaef9",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3546x291kz1pv",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a22crwmzux7ffr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2tmsm19ycexle",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a2wnw8a4mor7t7",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a16aksclsvcw9a",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a347bikldruuxm",
      "both voted wrong but different answer": 0,
      "just one voted right": 4,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3546x291kz1pv",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a1ngxqmobcxdc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "a3il7zprl8su05",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a1vksxdk4qaef9",
      "both voted wrong but different answer": 1,
      "just one voted right": 0,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1ngxqmobcxdc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 5,
      "m1": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 2,
      "just one voted right": 3,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 5,
      "m1": 0
    },
    {
      "worker A": "a3gludqzgejl5g",
      "worker B": "maria",
      "both voted wrong but different answer": 3,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "awraxv1riyr0m",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "apul86331somr",
      "worker B": "azniefuivb2h0",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1xifpi36695gyy",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a1zq7a1cuv6rd8",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 4,
      "number of different given labels": 1,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a22crwmzux7ffr",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "worker B": "arx0s1cidjlox",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "arb4paabfrza4",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a16aksclsvcw9a",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a2gm2vil6j238n",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a1ngxqmobcxdc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a292qslc0but0o",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a15qfi76w7p5f0",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3il7zprl8su05",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a323ww03vm8089",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "arx0s1cidjlox",
      "worker B": "a3gxshlbnd9e92",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a2wnw8a4mor7t7",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "a34m93njc830dp",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a2wnw8a4mor7t7",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "a347bikldruuxm",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3546x291kz1pv",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "azniefuivb2h0",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3gxshlbnd9e92",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 4,
      "m1": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1e6rs45guafc3",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 2,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "a3mwv912lnfd67",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a1xifpi36695gyy",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "worker B": "a16aksclsvcw9a",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a182jw8u6po60u",
      "worker B": "a3gxshlbnd9e92",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a1hdze291yubo5",
      "worker B": "a1vksxdk4qaef9",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2gng3wn85say6",
      "worker B": "ai45ndjpuioej",
      "both voted wrong but different answer": 0,
      "just one voted right": 7,
      "times they voted the same": 4,
      "number of different given labels": 1,
      "number of common tasks": 11,
      "m1": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a2wnw8a4mor7t7",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a1vksxdk4qaef9",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a3kvu2c809dok5",
      "worker B": "a292qslc0but0o",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3il7zprl8su05",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1sba5axpqhien",
      "worker B": "maria",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 11,
      "number of different given labels": 1,
      "number of common tasks": 12,
      "m1": 0
    },
    {
      "worker A": "atiqnur",
      "worker B": "a3rlcgrxa34gc0",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 1,
      "just one voted right": 0,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a1hdze291yubo5",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "a3mwv912lnfd67",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "awraxv1riyr0m",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "azniefuivb2h0",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "azniefuivb2h0",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "azniefuivb2h0",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "azniefuivb2h0",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a2ufd1i8zo1v4g",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "a3kvu2c809dok5",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a2tmsm19ycexle",
      "worker B": "apul86331somr",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "maria",
      "worker B": "a1xifpi36695gyy",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "worker B": "atiqnur",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 2,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a182jw8u6po60u",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1aq2yedwrxb2e",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "maria",
      "worker B": "a2wnw8a4mor7t7",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a1xifpi36695gy",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1e6rs45guafc3",
      "both voted wrong but different answer": 0,
      "just one voted right": 3,
      "times they voted the same": 3,
      "number of different given labels": 1,
      "number of common tasks": 6,
      "m1": 0
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "worker B": "a1xifpi36695gy",
      "both voted wrong but different answer": 0,
      "just one voted right": 0,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    },
    {
      "worker A": "a16aksclsvcw9a",
      "worker B": "a2gng3wn85say6",
      "both voted wrong but different answer": 1,
      "just one voted right": 1,
      "times they voted the same": 1,
      "number of different given labels": 1,
      "number of common tasks": 3,
      "m1": 0
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "worker B": "a1vksxdk4qaef9",
      "both voted wrong but different answer": 0,
      "just one voted right": 2,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 2,
      "m1": 0
    },
    {
      "worker A": "a347bikldruuxm",
      "worker B": "a1sba5axpqhien",
      "both voted wrong but different answer": 0,
      "just one voted right": 1,
      "times they voted the same": 0,
      "number of different given labels": 1,
      "number of common tasks": 1,
      "m1": 0
    }
];
const randomsep = 
[
    {
      "worker A": "awraxv1riyr0m",
      "voted tasks": 1,
      "randomSep": 1
    },
    {
      "worker A": "azniefuivb2h0",
      "voted tasks": 1,
      "randomSep": 1
    },
    {
      "worker A": "arb4paabfrza4",
      "voted tasks": 4,
      "randomSep": 1
    },
    {
      "worker A": "a1xifpi36695gyy",
      "voted tasks": 1,
      "randomSep": 1
    },
    {
      "worker A": "a2ybgz2h2kso5t",
      "voted tasks": 10,
      "randomSep": 1
    },
    {
      "worker A": "a34m93njc830dp",
      "voted tasks": 10,
      "randomSep": 1
    },
    {
      "worker A": "a292qslc0but0o",
      "voted tasks": 1,
      "randomSep": 1
    },
    {
      "worker A": "a16aksclsvcw9a",
      "voted tasks": 10,
      "randomSep": 0.933
    },
    {
      "worker A": "a2ufd1i8zo1v4g",
      "voted tasks": 1232,
      "randomSep": 0.901
    },
    {
      "worker A": "a1kaxclah6uvms",
      "voted tasks": 10,
      "randomSep": 0.9
    },
    {
      "worker A": "a1zq7a1cuv6rd8",
      "voted tasks": 10,
      "randomSep": 0.9
    },
    {
      "worker A": "a1xifpi36695gy",
      "voted tasks": 53,
      "randomSep": 0.893
    },
    {
      "worker A": "a3rlcgrxa34gc0",
      "voted tasks": 92,
      "randomSep": 0.884
    },
    {
      "worker A": "aj74bnwtcx0mj",
      "voted tasks": 70,
      "randomSep": 0.843
    },
    {
      "worker A": "a1hdze291yubo5",
      "voted tasks": 140,
      "randomSep": 0.84
    },
    {
      "worker A": "a3mwv912lnfd67",
      "voted tasks": 4,
      "randomSep": 0.833
    },
    {
      "worker A": "a1sba5axpqhien",
      "voted tasks": 232,
      "randomSep": 0.812
    },
    {
      "worker A": "a2gng3wn85say6",
      "voted tasks": 1075,
      "randomSep": 0.806
    },
    {
      "worker A": "apul86331somr",
      "voted tasks": 743,
      "randomSep": 0.805
    },
    {
      "worker A": "a3kvu2c809dok5",
      "voted tasks": 2944,
      "randomSep": 0.803
    },
    {
      "worker A": "a1aq2yedwrxb2e",
      "voted tasks": 100,
      "randomSep": 0.787
    },
    {
      "worker A": "maria",
      "voted tasks": 92,
      "randomSep": 0.779
    },
    {
      "worker A": "a22crwmzux7ffr",
      "voted tasks": 3,
      "randomSep": 0.778
    },
    {
      "worker A": "a323ww03vm8089",
      "voted tasks": 20,
      "randomSep": 0.767
    },
    {
      "worker A": "a3ux2fxa3nmjcs",
      "voted tasks": 40,
      "randomSep": 0.758
    },
    {
      "worker A": "arx0s1cidjlox",
      "voted tasks": 30,
      "randomSep": 0.755
    },
    {
      "worker A": "atiqnur",
      "voted tasks": 194,
      "randomSep": 0.744
    },
    {
      "worker A": "a2tmsm19ycexle",
      "voted tasks": 10,
      "randomSep": 0.7
    },
    {
      "worker A": "a182jw8u6po60u",
      "voted tasks": 280,
      "randomSep": 0.696
    },
    {
      "worker A": "a3gxshlbnd9e92",
      "voted tasks": 3,
      "randomSep": 0.667
    },
    {
      "worker A": "a1e6rs45guafc3",
      "voted tasks": 6,
      "randomSep": 0.667
    },
    {
      "worker A": "a3il7zprl8su05",
      "voted tasks": 11,
      "randomSep": 0.667
    },
    {
      "worker A": "a3qief1hbf69y4",
      "voted tasks": 3,
      "randomSep": 0.667
    },
    {
      "worker A": "ac6pi4sad0n05",
      "voted tasks": 10,
      "randomSep": 0.667
    },
    {
      "worker A": "a15qfi76w7p5f0",
      "voted tasks": 10,
      "randomSep": 0.666
    },
    {
      "worker A": "a3gludqzgejl5g",
      "voted tasks": 22,
      "randomSep": 0.636
    },
    {
      "worker A": "a24n92d5wypbbz",
      "voted tasks": 5,
      "randomSep": 0.6
    },
    {
      "worker A": "ai45ndjpuioej",
      "voted tasks": 32,
      "randomSep": 0.573
    },
    {
      "worker A": "a2gm2vil6j238n",
      "voted tasks": 2,
      "randomSep": 0.5
    },
    {
      "worker A": "a347bikldruuxm",
      "voted tasks": 4,
      "randomSep": 0.5
    },
    {
      "worker A": "a1ngxqmobcxdc3",
      "voted tasks": 7,
      "randomSep": 0.476
    },
    {
      "worker A": "a3546x291kz1pv",
      "voted tasks": 7,
      "randomSep": 0.333
    },
    {
      "worker A": "a2wnw8a4mor7t7",
      "voted tasks": 3,
      "randomSep": 0.333
    },
    {
      "worker A": "a1vksxdk4qaef9",
      "voted tasks": 3,
      "randomSep": 0
    }
];


class LineMetricChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: []
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
  }



  dataWrapper() {
    /*if(this.props.data.length==0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 10, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")

      g.append("text")
        .text("Choose a Task")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {*/
      this.buildGraph()
    //}
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color

    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
        
    var data = this.props.data/*.sort( function(a,b) {
      return (Number(a[x]) > Number(b[x])) ? 1 : ((Number(b[x]) > Number(a[x])) ? -1 : 0);
    })*/
    
    var xscale = d3.scaleOrdinal()
        //.domain( randomsep.map(d => d["worker A"]) )
        .domain( cohen.map(d => d["worker A"]+", "+d["worker B"]) )
        .range(cohen.map( (d,i) => i*(width/cohen.length)))
    var xAxis = d3.axisBottom(xscale)
      .tickFormat("")


    var yscale = d3.scaleLinear()
        .domain(d3.extent(cohen, d => d["cohen's kappa correlation"]))
        .range([height, 0])
    var yAxis = d3.axisLeft(yscale);

    g.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis)
       .selectAll("text")
          .attr("text-anchor","end")
          .attr("dx","-.8em")
          .attr("dy","-.5em")
          .attr("transform","rotate(-65)")
       /*.append("text")
          .attr("fill","black")
          .attr("transform","translate("+(width-10)+",0)")
          .attr("dy","-1em")
          .text(this.props.x);*/

    g.append("g")
       .attr("class","y axis")
       .call(yAxis)
       /*.append("text")
          .attr("fill","black")
          .attr("transform","rotate(-90)")
          .attr("text-anchor","end")
          .attr("dy","2em")
          .text("%");*/

    //deploy data to be displayed on a line
    var line = d3.line()
        .x( d => xscale(d["worker A"]+", "+d["worker B"]) )
        .y( d => yscale(d["cohen's kappa correlation"]) )
        .curve(d3.curveMonotoneX);


    var m1data = []
    cohen.map( (step1,i) => {
      m1.map( step2 => {
        if(step2["worker A"]==step1["worker A"] && step2["worker B"]==step1["worker B"]) {
          //console.log(step1["worker A"], step1["worker B"], step2["m1"])
          m1data[i] = {
            "worker A": step1["worker A"],
            "worker B": step1["worker B"],
            "m1": step2["m1"]
          }
        }
      })
    })

    /*var randomsepdata = []
    cohen.map( (step1,i) => {
      randomsep.map( step2 => {
        if(step2["worker A"]==step1["worker A"]) {
          randomsepdata[i] = {
            "worker A": step1["worker A"],
            "worker B": step1["worker B"],
            "randomSep": step2["randomSep"]
          }
        }
      })
    })
    console.log(randomsepdata)*/
    var line2 = d3.line()
      .x( d => xscale(d["worker A"]+", "+d["worker B"]) )
      .y( d => yscale(d["m1"]) )
      .curve(d3.curveMonotoneX);

    /*var line3 = d3.line()
      .x( d => xscale(d["worker A"]+", "+d["worker B"]) )
      .y( d => yscale(d['randomSep']) )
      .curve(d3.curveMonotoneX);*/

    g.append("path")
      .datum(cohen)
      .attr("class","original")
      .attr("d", line)
      .style("stroke", 'steelblue')
      .style("fill","none")
      .style("stroke-width",1)

    g.append("path")
      .datum(m1data)
      .attr("class","original")
      .attr("d", line2)
      .style("stroke", 'orange')
      .style("fill","none")
      .style("stroke-width",1)

    /*g.append("path")
      .datum(randomsepdata)
      .attr("class","original")
      .attr("d", line3)
      .style("stroke", 'lightgreen')
      .style("fill","none")
      .style("stroke-width",1)*/

    g.selectAll(".dot2")
      .data(cohen).enter()
        .append("circle")
        .style("fill", 'steelblue')
        .attr("class","dot2")
        .attr("cx", (d,i) => xscale(i) )
        .attr("cy", d => yscale(d["cohen's kappa correlation"]) )
        .attr("r",0.5)
        .on("move", d => {
          console.log(d)
        })

    g.selectAll(".dot")
      .data(m1data).enter()
        .append("circle")
        .style("fill", 'orange')
        .attr("class","dot")
        .attr("cx", (d,i) => xscale(i) )
        .attr("cy", d => yscale(d["m1"]) )
        .attr("r",0.5)
        .on("move", d => {
          console.log(d)
        })

    
        /*.on("click", (d) => {
          this.setState({
            clicked: []
          })
          data.map(step => {
            if(step[x] === d[x] && step[y] === d[y]) {
              var nuovo = this.state.clicked.concat([step])
              this.setState({
                clicked: nuovo
              })
            }
          })
        })*/
        
        

  }

  componentDidMount() {
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {
    //console.log(this.props)
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    return(
      <div>
        <svg className={this.props.selector} width="1000" height="400"> </svg>
        <br />
        <strong>Clicked data:</strong> {this.state.clicked.map( d =>
      z!='' ?
        <React.Fragment>
          {x+" : "}<strong style={{color: 'steelblue'}}>{d[x]}</strong>{", "}
          {y+" : "}<strong style={{color: 'steelblue'}}>{d[z[0]]+"/"+d[z[1]]}</strong>{" = "}
          <strong style={{color: 'steelblue'}}>{d[y]}</strong>{" %"}
        </React.Fragment>
      : <React.Fragment>
          {x+" : "}<strong style={{color: 'steelblue'}}>{d[x]}</strong>{", "}
          {y+" : "}<strong style={{color: 'steelblue'}}>{d[y]}</strong>{" %"}
        </React.Fragment>
        )}
      </div>
    )
  }
}

LineMetricChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(LineMetricChart);
