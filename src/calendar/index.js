
import React, { Component, StyleSheet, TouchableHighlight, Text, View, ListView, Dimensions } from 'react-native';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

export default class Calendar extends Component {

    static defaultProps = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: '2018-01-27',
        disabledDate: () => null,
        onChange: () => {},
        range: false,
        defaultValue: []
    }
    //
    // static propTypes = {
    //     startDate: React.PropTypes.Array,
    //     endDate: React.propTypes.Array
    // }

    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        })
    }

    componentWillMount() {
        let { startDate, endDate } = this.props;
        let monthsMap = {};
        startDate     = moment(startDate);
        endDate       = moment(endDate);


        while (endDate.isSameOrAfter(startDate, 'day')) {
            let year     = startDate.year(),
                month    = startDate.month(),
                dateKey  = `${year}, ${month+1}`;

            monthsMap[dateKey] = [{year, month}];
            startDate = startDate.add(1, 'month');
        }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(monthsMap)
        });
    }

    _renderRow(rowData: string, sectionID: string, rowID: string) {
        return (
            <Month onPress={(date) => this._onPress(date)} {...rowData}/>
        )
    }

    _renderSectionHeader(sData, sID) {
        let data = sID.split(','),
            year = data[0],
            month = data[1];
        return <View style={styles.monthHeader}><Text>{`${year}年 ${month}月`}</Text></View>;
    }

    _renderHeader() {
        const WEEKS = ['一', '二', '三', '四', '五', '六' ,'日'];
        const headerItem = WEEKS.map((item, i) => {
            return <View key={i} style={styles.weekHeaderItem}><Text>{item}</Text></View>
        })

        return (
            <View style={styles.weekHeader}>
                {headerItem}
            </View>
        );
    }

    _onPress(date) {
        let value = this.value;
        let { range, onChange } = this.props;

        if (!value) {
            value = this.value = [];
        }
        if (!value[0]) {
            value[0] = date;
        }

        if (range && value.length === 1 && date !== value[0]) {
            if (moment(value[0]).isSameOrAfter(moment(date), 'day')) {
                value[0] = date;
            } else {
                value[1] = date;
                onChange && onChange(value.slice());
                this.value = null;
            }
        }

        if (!range) {
            this.props.onChange && this.props.onChange(value.slice());
            this.value = null;
        }
    }

    render() {
        return (
            <View style={[styles.container]}>
                {this._renderHeader()}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={ this._renderRow.bind(this)}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }
}

/**
 * 日历月份
 */
class Month extends Component {
    render() {
        let { month, year, onPress } = this.props;
        let startDay        = moment().year(year).month(month).date(1),
            endDay          = moment().year(year).month(month).date(1).add(1, 'month'),
            days            = [],
            emptyDays       = [];

        while (endDay.isAfter(startDay, 'day')) {
            let date = startDay.format('YYYY-MM-DD');

            days.push({
                date: date,
                text: startDay.date()
            });

            startDay = startDay.add(1, 'day');
        }

        emptyDays = (new Array(moment().year(year).month(month).date(0).day())).fill(1);
        return (
            <View style={styles.monthContainer}>
                {emptyDays.map((item, i) => {
                    return <View key={i} style={styles.dayItem} />
                })}
                {days.map((item, i) => {
                    return (
                        <Day key={i} {...item} onPress={onPress}/>
                    )
                })}
            </View>
        )
    }
}

class Day extends Component {
    _onPress(date, e) {
        this.props.onPress(date);
    }
    render() {
        let { date, text } = this.props;

        return (
            <View style={styles.dayItem}>
                <TouchableHighlight
                    underlayColor="#108ee9"
                    style={styles.dayItemInner}
                    ref={(c) => this._refDay = c}
                    onPress={(e) => this._onPress(date, e)}
                    >
                    <View>
                        <Text style={styles.dateText}>{text}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}
const { hairlineWidth, create } = StyleSheet;
const dayItemSize = (width / 7) - 1;

const styles = create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    monthContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        borderBottomWidth: hairlineWidth,
        borderBottomColor: '#eee'
    },
    weekHeader: {
        flexDirection: 'row',
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: hairlineWidth,
        borderBottomColor: '#aaa'
    },
    weekHeaderItem: {
        width: dayItemSize,
        alignItems: 'center',
    },
    monthHeader: {
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: hairlineWidth,
        borderBottomColor: '#ccc'
    },
    dayItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: dayItemSize,
        height: dayItemSize,
        overflow: 'hidden',
        borderBottomWidth: hairlineWidth,
        borderBottomColor: '#eee'
    },
    dayItemInner: {
        height: 38,
        width: 38,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 19
    },
    dateText: {
        color: '#333',
        fontSize: 14
    }
});
