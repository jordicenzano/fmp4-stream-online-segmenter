const fs = require('fs');
const path = require('path');

const assert = require('assert');

const underTest = require('../src/fmp4DashGenerator.js');

const moduleDir = __dirname;

describe('mp4atom_parser', function() {

    let input_av_vod_file_name = path.join(moduleDir,'fixtures/sourceAV_15s_fmp4.mp4');

    describe('parse moov atom and moof atoms from fpm4 video file', function () {
        let input_v_vod_file_name = path.join(moduleDir,'fixtures/source_15s_fmp4.mp4');

        //NOTE: The buffer needs to be manually modified to be able to do a deepEqual comparison
        const results_moov_model = {
            "size": 743,
            "type": "moov",
            "start_pos_rel": 0,
            "start_pos": 0,
            "data": {},
            "children": [
                {
                    "size": 108,
                    "type": "mvhd",
                    "start_pos_rel": 8,
                    "start_pos": 8,
                    "data": {
                        "version": 0,
                        "flags": [
                            0,
                            0,
                            0
                        ],
                        "creation_time": 0,
                        "modification_time": 0,
                        "timescale": 1000,
                        "duration": 0,
                        "rate": 1,
                        "volume": 1,
                        "reserved100": 0,
                        "reserved101": [
                            0,
                            0
                        ],
                        "matrix": [
                            65536,
                            0,
                            0,
                            0,
                            65536,
                            0,
                            0,
                            0,
                            1073741824
                        ],
                        "reserved2": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "next_track_ID": 2
                    }
                },
                {
                    "size": 489,
                    "type": "trak",
                    "start_pos_rel": 116,
                    "start_pos": 116,
                    "data": {},
                    "children": [
                        {
                            "size": 92,
                            "type": "tkhd",
                            "start_pos_rel": 124,
                            "start_pos": 124,
                            "data": {
                                "version": 0,
                                "flags": [
                                    0,
                                    0,
                                    3
                                ],
                                "creation_time": 0,
                                "modification_time": 0,
                                "track_ID": 1,
                                "reserved000": 0,
                                "duration": 0,
                                "reserved100": [
                                    0,
                                    0
                                ],
                                "layer": 0,
                                "alternate_group": 0,
                                "volume": 0,
                                "reserved101": 0,
                                "matrix": [
                                    65536,
                                    0,
                                    0,
                                    0,
                                    65536,
                                    0,
                                    0,
                                    0,
                                    1073741824
                                ],
                                "width": 320,
                                "height": 200
                            }
                        },
                        {
                            "size": 389,
                            "type": "mdia",
                            "start_pos_rel": 216,
                            "start_pos": 216,
                            "data": {},
                            "children": [
                                {
                                    "size": 32,
                                    "type": "mdhd",
                                    "start_pos_rel": 224,
                                    "start_pos": 224,
                                    "data": {
                                        "version": 0,
                                        "flags": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "creation_time": 0,
                                        "modification_time": 0,
                                        "timescale": 15360,
                                        "duration": 0,
                                        "language": 21956,
                                        "reserved100": 0
                                    }
                                },
                                {
                                    "size": 45,
                                    "type": "hdlr",
                                    "start_pos_rel": 256,
                                    "start_pos": 256,
                                    "data": {
                                        "version": 0,
                                        "flags": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "pre_defined": 0,
                                        "type": "vide",
                                        "reserved100": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "name": "VideoHandler"
                                    }
                                },
                                {
                                    "size": 304,
                                    "type": "minf",
                                    "start_pos_rel": 301,
                                    "start_pos": 301,
                                    "data": {},
                                    "children": [
                                        {
                                            "size": 20,
                                            "type": "vmhd",
                                            "start_pos_rel": 309,
                                            "start_pos": 309,
                                            "data": {
                                                "version": 0,
                                                "flags": [
                                                    0,
                                                    0,
                                                    1
                                                ],
                                                "graphicsmode": 0,
                                                "opcolor": [
                                                    0,
                                                    0,
                                                    0
                                                ]
                                            }
                                        },
                                        {
                                            "size": 36,
                                            "type": "dinf",
                                            "start_pos_rel": 329,
                                            "start_pos": 329,
                                            "data": {}
                                        },
                                        {
                                            "size": 240,
                                            "type": "stbl",
                                            "start_pos_rel": 365,
                                            "start_pos": 365,
                                            "data": {},
                                            "children": [
                                                {
                                                    "size": 164,
                                                    "type": "stsd",
                                                    "start_pos_rel": 373,
                                                    "start_pos": 373,
                                                    "data": {
                                                        "version": 0,
                                                        "flags": [
                                                            0,
                                                            0,
                                                            0
                                                        ],
                                                        "entry_count": 1,
                                                        "VisualSampleEntry": [
                                                            {
                                                                "size": 148,
                                                                "format": 1635148593,
                                                                "reserved100": [
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0
                                                                ],
                                                                "data_reference_index": 1,
                                                                "pre_defined100": 0,
                                                                "reserved101": 0,
                                                                "pre_defined101": [
                                                                    0,
                                                                    0,
                                                                    0
                                                                ],
                                                                "width": 320,
                                                                "height": 200,
                                                                "horizresolution": 72,
                                                                "vertresolution": 72,
                                                                "reserved102": 0,
                                                                "frame_count": 1,
                                                                "compressorname": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
                                                                "depth": 24,
                                                                "pre_defined102": -1,
                                                                "codec_data": {
                                                                    "size": 46,
                                                                    "format": "avcC",
                                                                    "codec_ini": Buffer.from([
                                                                        1,
                                                                        66,
                                                                        192,
                                                                        13,
                                                                        255,
                                                                        225,
                                                                        0,
                                                                        23,
                                                                        103,
                                                                        66,
                                                                        192,
                                                                        13,
                                                                        218,
                                                                        5,
                                                                        6,
                                                                        254,
                                                                        92,
                                                                        4,
                                                                        64,
                                                                        0,
                                                                        0,
                                                                        3,
                                                                        0,
                                                                        64,
                                                                        0,
                                                                        0,
                                                                        15,
                                                                        3,
                                                                        197,
                                                                        10,
                                                                        168,
                                                                        1,
                                                                        0,
                                                                        4,
                                                                        104,
                                                                        206,
                                                                        60,
                                                                        128
                                                                    ])
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stts",
                                                    "start_pos_rel": 537,
                                                    "start_pos": 537,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stsc",
                                                    "start_pos_rel": 553,
                                                    "start_pos": 553,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 20,
                                                    "type": "stsz",
                                                    "start_pos_rel": 569,
                                                    "start_pos": 569,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stco",
                                                    "start_pos_rel": 589,
                                                    "start_pos": 589,
                                                    "data": {}
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "size": 40,
                    "type": "mvex",
                    "start_pos_rel": 605,
                    "start_pos": 605,
                    "data": {}
                },
                {
                    "size": 98,
                    "type": "udta",
                    "start_pos_rel": 645,
                    "start_pos": 645,
                    "data": {}
                }
            ]
        };
        const results_moof_model = [
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 1
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 2173,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 0
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 2
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 3172,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 15360
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 3
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 4242,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 30720
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 4
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 4815,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 46080
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 5
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 5528,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 61440
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 6
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 5800,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 76800
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 7
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 6093,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 92160
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 8
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 6196,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 107520
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 9
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 6511,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 122880
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 10
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 6634,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 138240
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 11
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 6914,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 153600
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 12
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 7038,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 168960
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 13
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 7238,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 184320
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 14
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 7296,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 199680
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "size": 224,
                "type": "moof",
                "start_pos_rel": 0,
                "start_pos": 0,
                "data": {

                },
                "children": [
                    {
                        "size": 16,
                        "type": "mfhd",
                        "start_pos_rel": 8,
                        "start_pos": 8,
                        "data": {
                            "version": 0,
                            "flags": [
                                0,
                                0,
                                0
                            ],
                            "sequence_number": 15
                        }
                    },
                    {
                        "size": 200,
                        "type": "traf",
                        "start_pos_rel": 24,
                        "start_pos": 24,
                        "data": {

                        },
                        "children": [
                            {
                                "size": 28,
                                "type": "tfhd",
                                "start_pos_rel": 32,
                                "start_pos": 32,
                                "data": {
                                    "version": 0,
                                    "flags": {
                                        "fl0": 2,
                                        "fl1": 0,
                                        "na1": 0,
                                        "na2": 0,
                                        "default_sample_flags_present": 1,
                                        "default_sample_size_present": 1,
                                        "default_sample_duration_present": 1,
                                        "na3": 0,
                                        "sample_description_index_present": 0,
                                        "base_data_offset_present": 0
                                    },
                                    "track_ID": 1,
                                    "default_sample_duration": 512,
                                    "default_sample_size": 6942,
                                    "default_sample_flags": 16842752
                                }
                            },
                            {
                                "size": 20,
                                "type": "tfdt",
                                "start_pos_rel": 60,
                                "start_pos": 60,
                                "data": {
                                    "version": 1,
                                    "flags": [
                                        0,
                                        0,
                                        0
                                    ],
                                    "baseMediaDecodeTime": 215040
                                }
                            },
                            {
                                "size": 144,
                                "type": "trun",
                                "start_pos_rel": 80,
                                "start_pos": 80,
                                "data": {
                                    "version": 0,
                                    "flags": [
                                        0,
                                        2,
                                        5
                                    ],
                                    "sample_count": 30
                                }
                            }
                        ]
                    }
                ]
            }
        ];

        it('parse moov atom and check results', function (done) {

            let segmenter = new underTest.fmp4DashGenerator(false, "./", path.basename(input_v_vod_file_name));
            let moov_data_tree_model = null;
            let moof_data_tree_model = [];

            const process_moov = function (that, moov_data_tree) {
                moov_data_tree_model = moov_data_tree.model;
            };

            const process_moof = function (that, moof_data_tree) {
                moof_data_tree_model.push(moof_data_tree.model);
            };

            segmenter.setDataCallbacks(null, process_moov, process_moof);

            let readFileStream = new fs.createReadStream(input_v_vod_file_name);

            readFileStream.on("error", function() {
                assert.fail('error reading the file');
            });

            readFileStream.on("data", function(ts_packet_chunk) {

                segmenter.processDataChunk(ts_packet_chunk, function (err) {
                    assert.equal(err, null);

                    if (err)
                        readFileStream.destroy(); //Is error so cancel process
                });
            });

            readFileStream.on("end", function() {
                segmenter.processDataEnd(function (err, data) {

                    assert.deepEqual(moov_data_tree_model, results_moov_model, "MOOV parsing results are different")

                    assert.deepEqual(moof_data_tree_model, results_moof_model, "MOOV parsing results are different")

                    done();
                });
            });
        });
    });

    describe('parse moov atom from fpm4 video audio file', function () {
        let input_av_vod_file_name = path.join(moduleDir,'fixtures/sourceAV_15s_fmp4.mp4');

        //NOTE: The buffer needs to be manually modified to be able to do a deepEqual comparison
        const results_moov_model = {
            "size": 1199,
            "type": "moov",
            "start_pos_rel": 0,
            "start_pos": 0,
            "data": {},
            "children": [
                {
                    "size": 108,
                    "type": "mvhd",
                    "start_pos_rel": 8,
                    "start_pos": 8,
                    "data": {
                        "version": 0,
                        "flags": [
                            0,
                            0,
                            0
                        ],
                        "creation_time": 0,
                        "modification_time": 0,
                        "timescale": 1000,
                        "duration": 0,
                        "rate": 1,
                        "volume": 1,
                        "reserved100": 0,
                        "reserved101": [
                            0,
                            0
                        ],
                        "matrix": [
                            65536,
                            0,
                            0,
                            0,
                            65536,
                            0,
                            0,
                            0,
                            1073741824
                        ],
                        "reserved2": [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "next_track_ID": 2
                    }
                },
                {
                    "size": 489,
                    "type": "trak",
                    "start_pos_rel": 116,
                    "start_pos": 116,
                    "data": {},
                    "children": [
                        {
                            "size": 92,
                            "type": "tkhd",
                            "start_pos_rel": 124,
                            "start_pos": 124,
                            "data": {
                                "version": 0,
                                "flags": [
                                    0,
                                    0,
                                    3
                                ],
                                "creation_time": 0,
                                "modification_time": 0,
                                "track_ID": 1,
                                "reserved000": 0,
                                "duration": 0,
                                "reserved100": [
                                    0,
                                    0
                                ],
                                "layer": 0,
                                "alternate_group": 0,
                                "volume": 0,
                                "reserved101": 0,
                                "matrix": [
                                    65536,
                                    0,
                                    0,
                                    0,
                                    65536,
                                    0,
                                    0,
                                    0,
                                    1073741824
                                ],
                                "width": 320,
                                "height": 200
                            }
                        },
                        {
                            "size": 389,
                            "type": "mdia",
                            "start_pos_rel": 216,
                            "start_pos": 216,
                            "data": {},
                            "children": [
                                {
                                    "size": 32,
                                    "type": "mdhd",
                                    "start_pos_rel": 224,
                                    "start_pos": 224,
                                    "data": {
                                        "version": 0,
                                        "flags": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "creation_time": 0,
                                        "modification_time": 0,
                                        "timescale": 15360,
                                        "duration": 0,
                                        "language": 21956,
                                        "reserved100": 0
                                    }
                                },
                                {
                                    "size": 45,
                                    "type": "hdlr",
                                    "start_pos_rel": 256,
                                    "start_pos": 256,
                                    "data": {
                                        "version": 0,
                                        "flags": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "pre_defined": 0,
                                        "type": "vide",
                                        "reserved100": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "name": "VideoHandler"
                                    }
                                },
                                {
                                    "size": 304,
                                    "type": "minf",
                                    "start_pos_rel": 301,
                                    "start_pos": 301,
                                    "data": {},
                                    "children": [
                                        {
                                            "size": 20,
                                            "type": "vmhd",
                                            "start_pos_rel": 309,
                                            "start_pos": 309,
                                            "data": {
                                                "version": 0,
                                                "flags": [
                                                    0,
                                                    0,
                                                    1
                                                ],
                                                "graphicsmode": 0,
                                                "opcolor": [
                                                    0,
                                                    0,
                                                    0
                                                ]
                                            }
                                        },
                                        {
                                            "size": 36,
                                            "type": "dinf",
                                            "start_pos_rel": 329,
                                            "start_pos": 329,
                                            "data": {}
                                        },
                                        {
                                            "size": 240,
                                            "type": "stbl",
                                            "start_pos_rel": 365,
                                            "start_pos": 365,
                                            "data": {},
                                            "children": [
                                                {
                                                    "size": 164,
                                                    "type": "stsd",
                                                    "start_pos_rel": 373,
                                                    "start_pos": 373,
                                                    "data": {
                                                        "version": 0,
                                                        "flags": [
                                                            0,
                                                            0,
                                                            0
                                                        ],
                                                        "entry_count": 1,
                                                        "VisualSampleEntry": [
                                                            {
                                                                "size": 148,
                                                                "format": 1635148593,
                                                                "reserved100": [
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0
                                                                ],
                                                                "data_reference_index": 1,
                                                                "pre_defined100": 0,
                                                                "reserved101": 0,
                                                                "pre_defined101": [
                                                                    0,
                                                                    0,
                                                                    0
                                                                ],
                                                                "width": 320,
                                                                "height": 200,
                                                                "horizresolution": 72,
                                                                "vertresolution": 72,
                                                                "reserved102": 0,
                                                                "frame_count": 1,
                                                                "compressorname": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
                                                                "depth": 24,
                                                                "pre_defined102": -1,
                                                                "codec_data": {
                                                                    "size": 46,
                                                                    "format": "avcC",
                                                                    "codec_ini": Buffer.from([
                                                                        1,
                                                                        66,
                                                                        192,
                                                                        20,
                                                                        255,
                                                                        225,
                                                                        0,
                                                                        23,
                                                                        103,
                                                                        66,
                                                                        192,
                                                                        20,
                                                                        218,
                                                                        5,
                                                                        6,
                                                                        254,
                                                                        92,
                                                                        4,
                                                                        64,
                                                                        0,
                                                                        0,
                                                                        3,
                                                                        0,
                                                                        64,
                                                                        0,
                                                                        0,
                                                                        15,
                                                                        3,
                                                                        197,
                                                                        10,
                                                                        168,
                                                                        1,
                                                                        0,
                                                                        4,
                                                                        104,
                                                                        206,
                                                                        60,
                                                                        128
                                                                    ])
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stts",
                                                    "start_pos_rel": 537,
                                                    "start_pos": 537,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stsc",
                                                    "start_pos_rel": 553,
                                                    "start_pos": 553,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 20,
                                                    "type": "stsz",
                                                    "start_pos_rel": 569,
                                                    "start_pos": 569,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stco",
                                                    "start_pos_rel": 589,
                                                    "start_pos": 589,
                                                    "data": {}
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "size": 424,
                    "type": "trak",
                    "start_pos_rel": 605,
                    "start_pos": 605,
                    "data": {},
                    "children": [
                        {
                            "size": 92,
                            "type": "tkhd",
                            "start_pos_rel": 613,
                            "start_pos": 613,
                            "data": {
                                "version": 0,
                                "flags": [
                                    0,
                                    0,
                                    3
                                ],
                                "creation_time": 0,
                                "modification_time": 0,
                                "track_ID": 2,
                                "reserved000": 0,
                                "duration": 0,
                                "reserved100": [
                                    0,
                                    0
                                ],
                                "layer": 0,
                                "alternate_group": 1,
                                "volume": 1,
                                "reserved101": 0,
                                "matrix": [
                                    65536,
                                    0,
                                    0,
                                    0,
                                    65536,
                                    0,
                                    0,
                                    0,
                                    1073741824
                                ],
                                "width": 0,
                                "height": 0
                            }
                        },
                        {
                            "size": 324,
                            "type": "mdia",
                            "start_pos_rel": 705,
                            "start_pos": 705,
                            "data": {},
                            "children": [
                                {
                                    "size": 32,
                                    "type": "mdhd",
                                    "start_pos_rel": 713,
                                    "start_pos": 713,
                                    "data": {
                                        "version": 0,
                                        "flags": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "creation_time": 0,
                                        "modification_time": 0,
                                        "timescale": 44100,
                                        "duration": 0,
                                        "language": 21956,
                                        "reserved100": 0
                                    }
                                },
                                {
                                    "size": 45,
                                    "type": "hdlr",
                                    "start_pos_rel": 745,
                                    "start_pos": 745,
                                    "data": {
                                        "version": 0,
                                        "flags": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "pre_defined": 0,
                                        "type": "soun",
                                        "reserved100": [
                                            0,
                                            0,
                                            0
                                        ],
                                        "name": "SoundHandler"
                                    }
                                },
                                {
                                    "size": 239,
                                    "type": "minf",
                                    "start_pos_rel": 790,
                                    "start_pos": 790,
                                    "data": {},
                                    "children": [
                                        {
                                            "size": 16,
                                            "type": "smhd",
                                            "start_pos_rel": 798,
                                            "start_pos": 798,
                                            "data": {}
                                        },
                                        {
                                            "size": 36,
                                            "type": "dinf",
                                            "start_pos_rel": 814,
                                            "start_pos": 814,
                                            "data": {}
                                        },
                                        {
                                            "size": 179,
                                            "type": "stbl",
                                            "start_pos_rel": 850,
                                            "start_pos": 850,
                                            "data": {},
                                            "children": [
                                                {
                                                    "size": 103,
                                                    "type": "stsd",
                                                    "start_pos_rel": 858,
                                                    "start_pos": 858,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stts",
                                                    "start_pos_rel": 961,
                                                    "start_pos": 961,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stsc",
                                                    "start_pos_rel": 977,
                                                    "start_pos": 977,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 20,
                                                    "type": "stsz",
                                                    "start_pos_rel": 993,
                                                    "start_pos": 993,
                                                    "data": {}
                                                },
                                                {
                                                    "size": 16,
                                                    "type": "stco",
                                                    "start_pos_rel": 1013,
                                                    "start_pos": 1013,
                                                    "data": {}
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "size": 72,
                    "type": "mvex",
                    "start_pos_rel": 1029,
                    "start_pos": 1029,
                    "data": {}
                },
                {
                    "size": 98,
                    "type": "udta",
                    "start_pos_rel": 1101,
                    "start_pos": 1101,
                    "data": {}
                }
            ]
        };
        const results_moof_model = []; //TODO: add moof with audio

        it('parse moov atom and check results', function (done) {

            let segmenter = new underTest.fmp4DashGenerator(false, "./", path.basename(input_av_vod_file_name));
            let moov_data_tree_model = null;
            let moof_data_tree_model = [];

            const process_moov = function (that, moov_data_tree) {
                moov_data_tree_model = moov_data_tree.model;
            };

            const process_moof = function (that, moof_data_tree) {
                moof_data_tree_model.push(moof_data_tree.model);
            };

            segmenter.setDataCallbacks(null, process_moov, process_moof);

            let readFileStream = new fs.createReadStream(input_av_vod_file_name);

            readFileStream.on("error", function() {
                assert.fail('error reading the file');
            });

            readFileStream.on("data", function(ts_packet_chunk) {

                segmenter.processDataChunk(ts_packet_chunk, function (err) {
                    //TODO: For now only accepts video
                    //TODO: Modify this test
                    assert.equal(err.message, "Number of tracks found != 1. Only 1 video track is allowed in this version");

                    if (err) {
                        readFileStream.destroy(); //Is error so cancel process

                        assert.deepEqual(moov_data_tree_model, results_moov_model, "MOOV parsing results are different");

                        done();
                    }

                });
            });

            readFileStream.on("end", function() {
                segmenter.processDataEnd(function (err, data) {

                    assert.deepEqual(moov_data_tree_model, results_moov_model, "MOOV parsing results are different");

                    done();
                });
            });
        });
    });
});
