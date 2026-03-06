import { NextResponse } from 'next/server'

const MOCK_MEMBERS_BY_GROUP: Record<string, object[]> = {
  'grp-1': [
    { group_member_id: 'gm-1', group_id: 'grp-1', member_id: 'mem-1', guest_id: null, participant_type: 'member', joined_at: '2026-01-03T09:00:00Z', removed_at: null, nickname: '홍길동', email: 'hong@school.kr' },
    { group_member_id: 'gm-2', group_id: 'grp-1', member_id: 'mem-2', guest_id: null, participant_type: 'member', joined_at: '2026-01-05T10:00:00Z', removed_at: null, nickname: '김철수', email: 'kim@school.kr' },
    { group_member_id: 'gm-3', group_id: 'grp-1', member_id: null, guest_id: 'gst-1', participant_type: 'guest', joined_at: '2026-01-10T11:00:00Z', removed_at: null, nickname: '이영희', email: 'lee@gmail.com' },
    { group_member_id: 'gm-4', group_id: 'grp-1', member_id: 'mem-3', guest_id: null, participant_type: 'member', joined_at: '2026-01-12T09:30:00Z', removed_at: null, nickname: '박민준', email: 'park@school.kr' },
    { group_member_id: 'gm-5', group_id: 'grp-1', member_id: 'mem-4', guest_id: null, participant_type: 'member', joined_at: '2026-01-15T08:00:00Z', removed_at: null, nickname: '최수아', email: 'choi@school.kr' },
  ],
  'grp-2': [
    { group_member_id: 'gm-6', group_id: 'grp-2', member_id: 'mem-1', guest_id: null, participant_type: 'member', joined_at: '2026-01-10T09:00:00Z', removed_at: null, nickname: '홍길동', email: 'hong@school.kr' },
    { group_member_id: 'gm-7', group_id: 'grp-2', member_id: 'mem-5', guest_id: null, participant_type: 'member', joined_at: '2026-01-11T10:00:00Z', removed_at: null, nickname: '정다은', email: 'jung@school.kr' },
  ],
  'grp-3': [
    { group_member_id: 'gm-8', group_id: 'grp-3', member_id: 'mem-2', guest_id: null, participant_type: 'member', joined_at: '2026-02-01T09:00:00Z', removed_at: null, nickname: '김철수', email: 'kim@school.kr' },
    { group_member_id: 'gm-9', group_id: 'grp-3', member_id: null, guest_id: 'gst-2', participant_type: 'guest', joined_at: '2026-02-03T11:00:00Z', removed_at: null, nickname: '게스트1', email: 'guest1@gmail.com' },
  ],
  'grp-4': [
    { group_member_id: 'gm-10', group_id: 'grp-4', member_id: null, guest_id: 'gst-10', participant_type: 'guest', joined_at: '2026-03-01T14:01:00Z', removed_at: null, nickname: '김민준', email: 'minjun@gmail.com' },
    { group_member_id: 'gm-11', group_id: 'grp-4', member_id: null, guest_id: 'gst-11', participant_type: 'guest', joined_at: '2026-03-01T14:01:30Z', removed_at: null, nickname: '이서연', email: 'seoyeon@gmail.com' },
    { group_member_id: 'gm-12', group_id: 'grp-4', member_id: null, guest_id: 'gst-12', participant_type: 'guest', joined_at: '2026-03-01T14:02:00Z', removed_at: null, nickname: '박지훈', email: 'jihun@gmail.com' },
    { group_member_id: 'gm-13', group_id: 'grp-4', member_id: 'mem-2', guest_id: null, participant_type: 'member', joined_at: '2026-03-01T14:02:10Z', removed_at: null, nickname: '김철수', email: 'kim@school.kr' },
  ],
  'grp-5': [
    { group_member_id: 'gm-14', group_id: 'grp-5', member_id: null, guest_id: 'gst-20', participant_type: 'guest', joined_at: '2026-03-04T10:31:00Z', removed_at: null, nickname: '최수아', email: 'sua@gmail.com' },
    { group_member_id: 'gm-15', group_id: 'grp-5', member_id: null, guest_id: 'gst-21', participant_type: 'guest', joined_at: '2026-03-04T10:31:30Z', removed_at: null, nickname: '정다은', email: 'daeun@gmail.com' },
    { group_member_id: 'gm-16', group_id: 'grp-5', member_id: null, guest_id: 'gst-22', participant_type: 'guest', joined_at: '2026-03-04T10:32:00Z', removed_at: null, nickname: '한서준', email: 'seojun@gmail.com' },
  ],
}

export async function GET(_: Request, { params }: { params: { groupId: string } }) {
  const members = MOCK_MEMBERS_BY_GROUP[params.groupId] ?? MOCK_MEMBERS_BY_GROUP['grp-1']
  return NextResponse.json(members)
}
