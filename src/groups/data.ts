import validator from "validator";
import nconf from "nconf";
import db from "../database";
import plugins from "../plugins";
import utils from "../utils";
import translator from "../translator";
import { GroupDataField, GroupDataObject } from "../types";
import coverPhoto = require("../coverPhoto");

const intFields: string[] = [
  "createtime",
  "memberCount",
  "hidden",
  "system",
  "private",
  "userTitleEnabled",
  "disableJoinRequests",
  "disableLeave",
];

interface GroupsInterface {
  getGroupsFields: (
    groupNames: string[],
    fields: string[],
  ) => Promise<GroupDataObject[]>;
  getGroupsData: (groupNames: string[]) => Promise<GroupDataObject[]>;
  getGroupField: (
    groupName: string,
    field: string,
  ) => Promise<GroupDataField | null>;
  getGroupFields: (
    groupName: string,
    fields: string[],
  ) => Promise<GroupDataObject | null>;
  getGroupData: (groupName: string) => Promise<GroupDataObject | null>;
  setGroupField: (
    groupName: string,
    field: string,
    value: GroupDataField,
  ) => Promise<void>;
  ephemeralGroups: string[];
  getEphemeralGroup: (groupName: string) => GroupDataObject;
}

function escapeGroupData(group: GroupDataObject): void {
  if (group) {
    group.nameEncoded = encodeURIComponent(group.name);
    group.displayName = validator.escape(String(group.name));
    group.description = validator.escape(String(group.description || ""));
    group.userTitle = validator.escape(String(group.userTitle || ""));
    group.userTitleEscaped = translator.escape(group.userTitle);
  }
}

function modifyGroup(group: GroupDataObject, fields: string[]): void {
  if (group) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    db.parseIntFields(group, intFields, fields);

    escapeGroupData(group);
    group.userTitleEnabled = [null, undefined].includes(group.userTitleEnabled)
      ? 1
      : group.userTitleEnabled;
    group.labelColor = validator.escape(String(group.labelColor || "#000000"));
    group.textColor = validator.escape(String(group.textColor || "#ffffff"));
    group.icon = validator.escape(String(group.icon || ""));
    group.createtimeISO = utils.toISOString(group.createtime) as string;
    group.private = [null, undefined].includes(group.private)
      ? 1
      : group.private;
    group.memberPostCids = group.memberPostCids || "";
    group.memberPostCidsArray = group.memberPostCids
      .split(",")
      .map((cid) => parseInt(cid, 10))
      .filter(Boolean);

    group["cover:thumb:url"] = group["cover:thumb:url"] || group["cover:url"];

    if (group["cover:url"]) {
      group["cover:url"] = group["cover:url"].startsWith("http")
        ? group["cover:url"]
        : (nconf.get("relative_path") as string) + group["cover:url"];
    } else {
      group["cover:url"] = coverPhoto.getDefaultGroupCover(group.name);
    }

    if (group["cover:thumb:url"]) {
      group["cover:thumb:url"] = group["cover:thumb:url"].startsWith("http")
        ? group["cover:thumb:url"]
        : (nconf.get("relative_path") as string) + group["cover:thumb:url"];
    } else {
      group["cover:thumb:url"] = coverPhoto.getDefaultGroupCover(group.name);
    }

    group["cover:position"] = validator.escape(
      String(group["cover:position"] || "50% 50%"),
    );
  }
}

export = function (Groups: GroupsInterface) {
  Groups.getGroupsFields = async function (
    groupNames: string[],
    fields: string[],
  ): Promise<GroupDataObject[]> {
    if (!Array.isArray(groupNames) || !groupNames.length) {
      return [];
    }

    const ephemeralIdx: number[] = groupNames.reduce(
      (memo: number[], cur: string, idx: number) => {
        if (Groups.ephemeralGroups.includes(cur)) {
          memo.push(idx);
        }
        return memo;
      },
      [],
    );

    const keys: string[] = groupNames.map((groupName) => `group:${groupName}`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const groupData: GroupDataObject[] = (await db.getObjects(
      keys,
      fields,
    )) as GroupDataObject[];
    if (ephemeralIdx.length) {
      ephemeralIdx.forEach((idx: number) => {
        groupData[idx] = Groups.getEphemeralGroup(groupNames[idx]);
      });
    }

    groupData.forEach((group) => modifyGroup(group, fields));

    const results = (await plugins.hooks.fire("filter:groups.get", {
      groups: groupData,
    })) as { groups: GroupDataObject[] };
    return results.groups;
  };

  Groups.getGroupsData = async function (
    groupNames: string[],
  ): Promise<GroupDataObject[]> {
    return await Groups.getGroupsFields(groupNames, []);
  };

  Groups.getGroupData = async function (
    groupName: string,
  ): Promise<GroupDataObject | null> {
    const groupsData = await Groups.getGroupsData([groupName]);
    return Array.isArray(groupsData) && groupsData[0] ? groupsData[0] : null;
  };

  Groups.getGroupField = async function (
    groupName: string,
    field: string,
  ): Promise<GroupDataField | null> {
    const groupData: GroupDataObject | null = await Groups.getGroupFields(
      groupName,
      [field],
    );
    return groupData ? (groupData[field] as GroupDataField) : null;
  };

  Groups.getGroupFields = async function (
    groupName: string,
    fields: string[],
  ): Promise<GroupDataObject | null> {
    const groups = await Groups.getGroupsFields([groupName], fields);
    return groups ? groups[0] : null;
  };

  Groups.setGroupField = async function (
    groupName: string,
    field: string,
    value: GroupDataField,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await db.setObjectField(`group:${groupName}`, field, value);
    await plugins.hooks.fire("action:group.set", {
      field: field,
      value: value,
      type: "set",
    });
  };
};
