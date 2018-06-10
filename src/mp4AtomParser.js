//Jordi Cenzano 2018
const binparser = require('binary-parser').Parser;

"use strict";

const enAtomNames = {
    NONE: 'NONE',
    HEADER: 'HEAD',
    ALL:  'ALLL',
    MOOV: 'moov',
    MVHD: 'mvhd',
    MOOF: 'moof',
    MDAT: 'mdat',
    TRAK: 'trak',
    TKHD: 'tkhd',
    MDIA: 'mdia',
    MDHD: 'mdhd',
    HDLR: 'hdlr',
    MINF: 'minf',
    VMHD: 'vmhd',
    STBL: 'stbl',
    STSD: 'stsd',
    MFHD: 'mfhd',
    TRAF: 'traf',
    TFHD: 'tfhd',
    TFDT: 'tfdt',
    TRUN: 'trun'
};

const enTrackTypes = {
    ANY: {type: 'ANY'},
    UNKNOWN: {type: 'UNKN'},
    VIDEO: {type: 'vide'},
    AUDIO: {type: 'soun'},
    HINT: {type: 'hint'},
    METADATA: {type: 'meta'},
};

// Constructor
class mp4AtomParser {

    constructor(verbose = false) {

        this.verbose = verbose;
    
        //Utils
        this.stop_parse = new binparser();

        this.skip = new binparser()
            .endianess('big')
            .skip(function() { return 0 });

        this.atom_header = new binparser()
            .endianess('big')
            .uint32('size')
            .string('type', {
                encoding: 'ascii',
                length: 4
            });

        this.atom_mvhd_version0 = new binparser()
            .endianess('big')
            .int32('creation_time')
            .int32('modification_time')
            .int32('timescale')
            .int32('duration');

        this.atom_mvhd_version1 = new binparser()
            .endianess('big')
            .array('creation_time', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            })
            .array('modification_time', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            })
            .int32('timescale')
            .array('duration', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            });

        this.atom_tkhd_version0 = new binparser()
            .endianess('big')
            .int32('creation_time')
            .int32('modification_time')
            .int32('track_ID')
            .int32('reserved000')
            .int32('duration');

        this.atom_tkhd_version1 = new binparser()
            .endianess('big')
            .array('creation_time', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            })
            .array('modification_time', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            })
            .int32('track_ID')
            .int32('reserved000')
            .array('duration', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            });

        this.atom_tkhd = new binparser()
            .endianess('big')
            .uint8('version')
            .array('flags', {
                type: 'uint8',
                length: 3
            })
            .choice('', {
                tag: 'version',
                defaultChoice: this.stop_parse,
                choices: {
                    0: this.atom_tkhd_version0,
                    1: this.atom_tkhd_version1
                }
            })
            .array('reserved100', {
                type: 'int32be',
                length: 2,
                assert: 0
            })
            .int16('layer')
            .int16('alternate_group')
            .array('volume', {
                type: 'uint8',
                length: 2,
                formatter: function(arr) {
                    return Number(arr.join("."));
                }
            })
            .uint16('reserved101')
            .array('matrix', {
                type: 'uint32be',
                length: 9
            })
            .array('width', {
                type: 'uint16be',
                length: 2,
                formatter: function(arr) {
                    return Number(arr.join("."));
                }
            })
            .array('height', {
                type: 'uint16be',
                length: 2,
                formatter: function(arr) {
                    return Number(arr.join("."));
                }
            });
            
        this.atom_mvhd = new binparser()
            .endianess('big')
            .uint8('version')
            .array('flags', {
                type: 'uint8',
                length: 3
            })
            .choice('', {
                tag: 'version',
                defaultChoice: this.stop_parse,
                choices: {
                    0: this.atom_mvhd_version0,
                    1: this.atom_mvhd_version1
                }
            })
            .array('rate', {
                type: 'uint16be',
                length: 2,
                formatter: function(arr) {
                    return Number(arr.join("."));
                }
            })
            .array('volume', {
                type: 'uint8',
                length: 2,
                formatter: function(arr) {
                    return Number(arr.join("."));
                }
            })
            .uint16('reserved100', { assert: 0 })
            .array('reserved101', {
                type: 'int32be',
                length: 2,
                assert: 0
            })
            .array('matrix', {
                type: 'uint32be',
                length: 9
            })
            .array('reserved2', {
                type: 'int32be',
                length: 6,
                assert: 0
            })
            .int32('next_track_ID');

        this.atom_mdhd_version0 = new binparser()
            .endianess('big')
            .int32('creation_time')
            .int32('modification_time')
            .int32('timescale')
            .int32('duration');

        this.atom_mdhd_version1 = new binparser()
            .endianess('big')
            .array('creation_time', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            })
            .array('modification_time', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            })
            .int32('timescale')
            .array('duration', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            });

        this.atom_mdhd = new binparser()
            .endianess('big')
            .uint8('version')
            .array('flags', {
                type: 'uint8',
                length: 3
            })
            .choice('', {
                tag: 'version',
                defaultChoice: this.stop_parse,
                choices: {
                    0: this.atom_mdhd_version0,
                    1: this.atom_mdhd_version1
                }
            })
            .uint16('language')
            .uint16('reserved100', { assert: 0 });

        this.atom_hdlr = new binparser()
            .endianess('big')
            .uint8('version', { assert: 0 })
            .array('flags', {
                type: 'uint8',
                length: 3,
                assert: 0
            })
            .uint32('pre_defined', {assert: 0})
            .string('type', {
                encoding: 'ascii',
                length: 4
            })
            .array('reserved100', {
                type: 'int32be',
                length: 3,
                assert: 0
            })
            .string('name', {
                encoding: 'ascii',
                zeroTerminated: true
            });

        this.atom_vmhd = new binparser()
            .endianess('big')
            .uint8('version', { assert: 0 })
            .array('flags', {
                type: 'uint8',
                length: 3,
            })
            .uint16('graphicsmode')
            .array('opcolor', {
                type: 'int16be',
                length: 3
            });

        this.atom_stsd_video_sample_entry_ini_avc = new binparser()
            .endianess('big')
            .uint32('size')
            .string('format', {
                encoding: 'ascii',
                length: 4
            }) // .buffer IS NOT working in the browser! Better use .array
            .array('codec_ini', {
                type: 'uint8',
                length: function() {
                    return this.size - 8;
                }
            });

            /*.buffer('codec_ini', {
                clone: true,
                length: function() {
                    return this.size - 8;
                }
            });*/
            
        this.atom_stsd_video_sample_entry = new binparser()
            .endianess('big')
            .uint32('size')
            .uint32('format') //We need to read as a number to make the choice  
            .array('reserved100', {
                type: 'uint8',
                length: 6,
                assert: 0
            })
            .uint16('data_reference_index')
            .uint16('pre_defined100', { assert: 0 })
            .uint16('reserved101', { assert: 0 })
            .array('pre_defined101', {
                type: 'int32be',
                length: 3,
                assert: 0
            })
            .uint16('width')
            .uint16('height')
            .array('horizresolution', {
                type: 'uint16be',
                length: 2,
                formatter: function(arr) {
                    return Number(arr.join("."));
                }
            })
            .array('vertresolution', {
                type: 'uint16be',
                length: 2,
                formatter: function(arr) {
                    return Number(arr.join("."));
                }
            })
            .uint32('reserved102', { assert: 0 })
            .uint16('frame_count', { assert: 1 })
            .string('compressorname', {
                encoding: 'ascii',
                length: 32
            })
            .uint16('depth', { assert: 0x0018 })
            .int16('pre_defined102', { assert: -1 })
            .choice('codec_data', {
                tag: 'format',
                defaultChoice: this.stop_parse,
                choices: {
                    1635148593: this.atom_stsd_video_sample_entry_ini_avc, //1635148593 = 0x61766331 = avc1
                }
            });

        this.esURLString = new binparser()
            .endianess('big')
            .uint8('URLLength')
            .string('type', {
                encoding: 'ascii',
                length: "URLLength"
            });

        this.atom_esds = new binparser() //According to ISO/IEC 14496-1.
            .endianess('big')
            .uint32('size')
            .string('type', {
                encoding: 'ascii',
                length: 4
            })
            .uint8('version', { assert: 0 })
            .array('flags', {
                type: 'uint8',
                length: 3,
                assert: 0
            })
            .uint8('ESDescriptor', { assert: 0x03 })
            .uint8('ESDescriptorExt01')
            .uint8('ESDescriptorExt02')
            .uint8('ESDescriptorExt03')
            .uint8('ESDescriptorExtLength')
            .uint16('ESid')
            .bit1('streamDependenceFlag')
            .bit1('URLFlag')
            .bit1('OCRstreamFlag')
            .bit5('streamPriority')
            .choice('', {
                tag: 'streamDependenceFlag',
                defaultChoice: this.skip,
                choices: {
                    1: new binparser().endianess('big').uint16('dependsOnESID')
                }
            })
            .choice('', {
                tag: 'URLFlag',
                defaultChoice: this.skip,
                choices: {
                    1: this.esURLString
                }
            })
            .choice('', {
                tag: 'OCRstreamFlag',
                defaultChoice: this.skip,
                choices: {
                    1: new binparser().endianess('big').uint16('OCRESId')
                }
            })
            .uint8('DecoderConfigDescriptor', { assert: 0x04 })
            .uint8('DecoderConfigDescriptorExt01')
            .uint8('DecoderConfigDescriptorExt02')
            .uint8('DecoderConfigDescriptorExt03')
            .uint8('DecoderConfigDescriptorLength')

            .uint8('objectTypeIndication') //In this case indicates audio type, see ISO 14496-1
            .bit6('streamType') // = 5 is audio stream
            .bit1('upStream')
            .bit1('reserved100', {assert: 1})
            .array('bufferSizeDB', {
                type: 'uint8',
                length: 3,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2, 16) + arr[1] * Math.pow(2,  8) + arr[2];
                }
            })
            .uint32('maxBitrate')
            .uint32('avgBitrate')
            .uint8('AudioSpecificDecoderConfigDescriptor', { assert: 0x05 })
            .uint8('AudioSpecificDecoderConfigDescriptorExt01')
            .uint8('AudioSpecificDecoderConfigDescriptorExt02')
            .uint8('AudioSpecificDecoderConfigDescriptorExt03')
            .uint8('AudioSpecificDecoderConfigDescriptorLength')
            .bit5('ObjectType')
            //TODO: BUG in binary parser skip is byte aligned, object types >=32 NOT allowed in this implementation
            /*
            .choice('', {
                tag: 'ObjectType',
                defaultChoice: this.skip,
                choices: {
                    31: new binparser().endianess('big').bit6('ObjectTypeExt', {formatter: function (n) { return n + 32}})
                }
            })*/
            .bit4('FrequencyIndex')
            //TODO: BUG in binary parser skip is byte aligned, not statndart sampling freq not allowed in this implementation
            /*
            .choice('', {
                tag: 'FrequencyIndex',
                defaultChoice: this.skip,
                choices: {
                    15: new binparser().endianess('big').bit24('Frequency')
                }
            })*/
            .bit4('ChannelConfig')
            .bit3('ExtraAlignment');

        this.atom_stsd_audio_sample_entry = new binparser()
            .endianess('big')
            .uint32('size')
            .uint32('format') //We need to read as a number to make the choice
            .array('reserved100', {
                type: 'uint8',
                length: 6,
                assert: 0
            })
            .uint16('data_reference_index')
            .array('pre_defined100', {
                type: 'int32be',
                length: 2,
                assert: 0
            })
            .uint16('channelcount')
            .uint16('samplesize')
            .uint16('pre_defined101', {assert: 0})
            .uint16('reserved101', {assert: 0})
            .uint32('samplerate', {
                formatter: function (num) {
                    return (num>>16) & 0xFFFF;
                }
            })
            .choice('codec_data', {
                tag: 'format',
                defaultChoice: this.stop_parse,
                choices: {
                    1836069985: this.atom_esds, //1836069985 = 0x6D703461 = mp4a
                }
            });

        this.atom_stsd_video = new binparser()
            .endianess('big')
            .uint8('version', { assert: 0 })
            .array('flags', {
                type: 'uint8',
                length: 3,
                assert: 0
            })
            .uint32('entry_count')
            .array('VisualSampleEntry', {
                type: this.atom_stsd_video_sample_entry,
                length: 'entry_count'
            });

        this.atom_stsd_audio = new binparser()
            .endianess('big')
            .uint8('version', { assert: 0 })
            .array('flags', {
                type: 'uint8',
                length: 3,
                assert: 0
            })
            .uint32('entry_count')
            .array('AudioSampleEntry', {
                type: this.atom_stsd_audio_sample_entry,
                length: 'entry_count'
            });

        this.atom_mfhd = new binparser()
            .endianess('big')
            .uint8('version', { assert: 0 })
            .array('flags', {
                type: 'uint8',
                length: 3,
                assert: 0
            })
            .uint32('sequence_number');

        this.atom_tfhd = new binparser()
            .uint8('version', { assert: 0 })
            .nest('flags', {
                type: new binparser()
                    .endianess('big')
                    .uint8('fl0')
                    .uint8('fl1')
                    .bit1('na1')
                    .bit1('na2')
                    .bit1('default_sample_flags_present')
                    .bit1('default_sample_size_present')
                    .bit1('default_sample_duration_present')
                    .bit1('na3')
                    .bit1('sample_description_index_present')
                    .bit1('base_data_offset_present')
            })
            .uint32('track_ID')
            .choice('', {
                tag: 'flags.base_data_offset_present',
                defaultChoice: this.skip,
                choices: {
                    1: new binparser()
                        .endianess('big')
                        .array('base_data_offset', {
                            type: 'uint32be',
                            length: 2,
                            formatter: function(arr) {
                                return arr[0] * Math.pow(2,32) + arr[1];
                            }
                        })
                }
            })
            .choice('', {
                tag: 'flags.sample_description_index_present',
                defaultChoice: this.skip,
                choices: {
                    1: new binparser()
                        .endianess('big')
                        .uint32('sample_description_index')
                }
            })
            .choice('', {
                tag: 'flags.default_sample_duration_present',
                defaultChoice: this.skip,
                choices: {
                    1: new binparser()
                        .endianess('big')
                        .uint32('default_sample_duration')
                }
            })
            .choice('', {
                tag: 'flags.default_sample_size_present',
                defaultChoice: this.skip,
                choices: {
                    1: new binparser()
                        .endianess('big')
                        .uint32('default_sample_size')
                }
            })
            .choice('', {
                tag: 'flags.default_sample_flags_present',
                defaultChoice: this.skip,
                choices: {
                    1: new binparser()
                        .endianess('big')
                        .uint32('default_sample_flags')
                }
            });

        this.atom_tfdt_version0 = new binparser()
            .endianess('big')
            .uint32('baseMediaDecodeTime');

        this.atom_tfdt_version1 = new binparser()
            .endianess('big')
            .array('baseMediaDecodeTime', {
                type: 'uint32be',
                length: 2,
                formatter: function(arr) {
                    return arr[0] * Math.pow(2,32) + arr[1];
                }
            });

        this.atom_tfdt = new binparser()
            .endianess('big')
            .uint8('version')
            .array('flags', {
                type: 'uint8',
                length: 3
            })
            .choice('', {
                tag: 'version',
                defaultChoice: this.stop_parse,
                choices: {
                    0: this.atom_tfdt_version0,
                    1: this.atom_tfdt_version1
                }
            });

        this.atom_trun = new binparser()
            .endianess('big')
            .uint8('version')
            .array('flags', {
                type: 'uint8',
                length: 3
            })
            .uint32('sample_count');
        //No need more data from trun


        //Atoms IDs
        this.enAtomTypes = {
            NONE: {type: enAtomNames.NONE, is_container: false, parser: null},
            HEADER: {type: enAtomNames.HEADER, is_container: false, parser: this.atom_header},
            ALL:  {type: enAtomNames.ALL, is_container: false, parser: null},
            MOOV: {type: enAtomNames.MOOV, is_container: true, parser: null},
            MVHD: {type: enAtomNames.MVHD, is_container: false, parser: this.atom_mvhd},
            MOOF: {type: enAtomNames.MOOF, is_container: true, parser: null},
            MDAT: {type: enAtomNames.MDAT, is_container: false, parser: null},
            TRAK: {type: enAtomNames.TRAK, is_container: true, parser: null},
            TKHD: {type: enAtomNames.TKHD, is_container: false, parser: this.atom_tkhd},
            MDIA: {type: enAtomNames.MDIA, is_container: true, parser: null},
            MDHD: {type: enAtomNames.MDHD, is_container: false, parser: this.atom_mdhd},
            HDLR: {type: enAtomNames.HDLR, is_container: false, parser: this.atom_hdlr},
            MINF: {type: enAtomNames.MINF, is_container: true, parser: null},
            VMHD: {type: enAtomNames.VMHD, is_container: false, parser: this.atom_vmhd},
            STBL: {type: enAtomNames.STBL, is_container: true, parser: null},
            MFHD: {type: enAtomNames.MFHD, is_container: false, parser: this.atom_mfhd},
            TRAF: {type: enAtomNames.TRAF, is_container: true, parser: null},
            TFHD: {type: enAtomNames.TFHD, is_container: false, parser: this.atom_tfhd},
            TFDT: {type: enAtomNames.TFDT, is_container: false, parser: this.atom_tfdt},
            TRUN: {type: enAtomNames.TRUN, is_container: false, parser: this.atom_trun},
            STSD: {type: enAtomNames.STSD, is_container: false, parser: [
                    { [enTrackTypes.VIDEO.type]: this.atom_stsd_video },
                    { [enTrackTypes.AUDIO.type]: this.atom_stsd_audio }
                ]
            },

            getParser(type, track_type) {
                for (let prop in this) {
                    let elem = this[prop];
                    if ((typeof(elem) === 'object') && ('type' in elem) && (elem.type === type)) {
                        if (Array.isArray(elem.parser)) {
                            for (let i = 0; i < elem.parser.length; i++) {
                                let parser_elem = elem.parser[i];

                                for (let prop_track in parser_elem) {
                                    if (prop_track === track_type)
                                        return parser_elem[prop_track];
                                }
                            }
                        }
                        else {
                            return elem.parser;
                        }
                    }
                }
                return null;
            },

            isContanier(type) {
                let ret = false;
                for (let prop in this) {
                    let elem = this[prop];
                    if ((typeof(elem) === 'object') && ('type' in elem) && (elem.type === type)) {
                        return elem.is_container;
                    }
                }
                return ret;
            }
        };
    }
}

//Export class
module.exports.mp4AtomParser = mp4AtomParser;
module.exports.enAtomNames = enAtomNames;
module.exports.enTrackTypes = enTrackTypes;
