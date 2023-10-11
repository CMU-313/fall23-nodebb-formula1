import _ from 'lodash';
import db from '../database';
import plugins from '../plugins';

type Bug = {
    bid: number,
    name: string,
    description: string,
    timestamp: string,
    resolved: boolean,
}

type PostData = {
    bugData: Bug
}

interface BugsInterface {
    create: (data: Bug) => Promise<number>,
    post: (data: Bug) => Promise<PostData>,
}

export = function (Bugs: BugsInterface) {
    Bugs.create = async function (data : Bug): Promise<number> {
        const timestamp = data.timestamp || Date.now();

        /* eslint-disable max-len */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        const bid: number = await db.incrObjectField('global', 'nextBid');
        /* eslint-enable max-len */

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await plugins.hooks.fire('filter:bug.create', { bug: data, data: data });

        /* eslint-disable max-len */
        // eslint-disable-next-line max-len, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions
        await db.setObject(`bug:${bid}`, data);
        /* eslint-enable max-len */

        const timestampedSortedSetKeys: string[] = ['bugs:bid'];

        await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            db.sortedSetsAdd(timestampedSortedSetKeys, timestamp, data.bid),
        ]);

        await plugins.hooks.fire('action:bug.save', { bug: _.clone(data), data: data });
        return data.bid;
    };

    Bugs.post = async function (data: Bug): Promise<PostData> {
        // if (!data) {
        //     return { bugData: data };
        // }

        console.log(data)
        const bid = await Bugs.create(data);
        const bugData: Bug = data;
        bugData.bid = bid;

        await plugins.hooks.fire('action:bug.post', { bug: bugData, data: data });

        return {
            bugData: bugData,
        };
    };
}
