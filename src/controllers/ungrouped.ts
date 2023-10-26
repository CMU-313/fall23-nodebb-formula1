import { Request, Response, NextFunction } from "express";

import helpers from "./helpers";
import Topics from "../topics";
import User from "../user";
import Groups from "../groups";
import { TopicObject } from "../types/topic";
import { GroupFullObject } from "../types/group";
import { Breadcrumb } from "../types";

interface GetRequest extends Request {
  uid: number;
}

interface UngroupedOutputData extends TopicData {
  groups: GroupFullObject[];
  uid: number;
  title: string;
  breadcrumbs: Breadcrumb;
}

interface TopicData {
  // Consistent with inteface in src/topics/ungrouped.js
  tids: number[];
  nextStart: number;
  topicsCount: number;
  topics: TopicObject[];
}

// eslint-disable-next-line import/prefer-default-export
export const get = async function (
  req: GetRequest,
  res: Response,
  next: NextFunction,
) {
  const { uid } = req;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const ungroupedTopicsData = (await Topics.getUngroupedTopics(
    uid,
  )) as TopicData; // Ungrouped topics

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const userGroups = (
    (await Groups.getUserGroups([uid])) as GroupFullObject[][]
  )[0];

  if (!ungroupedTopicsData || !userGroups) {
    return next();
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const [canPost] = (await User.exists([uid])) as boolean[];

  const breadcrumbs = [{ text: "Ungrouped" }];

  const data = {
    ...ungroupedTopicsData,
    groups: userGroups,
    uid: uid,
    canPost,
    title: "Ungrouped Topics",
    breadcrumbs: helpers.buildBreadcrumbs(breadcrumbs),
  } as UngroupedOutputData;

  res.render("ungrouped", data);
};
