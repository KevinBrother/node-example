import Axios from 'axios';
import { BackendStorageProps } from '@interfaces';

export interface UniquenessChecker {
    code: string;
    type: string;
    identity: string;
}

export async function uniquenessValidator (params: UniquenessChecker): Promise<void> {
    //
    const { code, type, identity } = params;
    //
    const { data: res }: { data: BackendStorageProps } = await Axios({
        method: 'get',
        url: `${process.env.BACKEND_BASE_URL}/api/v1/storage/${code}`
    });
    //
    if (Number(res.status) === 1) {
        //
        const data = JSON.parse(res?.data?.json || '{}');
        //
        const passport = data.code === code && data.type === type;
        //
        if (passport) {
            throw (new Error(`类型[${type}]已存在编号[${code}]`));
        }
    }
};
