"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserSummary = toUserSummary;
exports.toUser = toUser;
exports.toTestRequest = toTestRequest;
exports.toLab = toLab;
exports.toPatientSummary = toPatientSummary;
exports.toPatient = toPatient;
exports.toSpecimen = toSpecimen;
exports.toWsiInfo = toWsiInfo;
exports.toCustodyEvent = toCustodyEvent;
exports.toReportSummary = toReportSummary;
exports.toReportVersion = toReportVersion;
exports.toReportDetail = toReportDetail;
exports.toCaseListItem = toCaseListItem;
exports.toAuditLog = toAuditLog;
const format_1 = require("../utils/format");
function toUserSummary(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        subspecialties: [...user.subspecialties],
        disciplines: [...(user.disciplines ?? [])],
    };
}
function toUser(user) {
    return {
        ...toUserSummary(user),
        phone: user.phone ?? null,
        active: user.active,
        mustChangePassword: user.mustChangePassword ?? false,
        lastLoginAt: (0, format_1.toIso)(user.lastLoginAt),
        createdAt: (0, format_1.toIso)(user.createdAt) ?? new Date().toISOString(),
    };
}
function toTestRequest(request) {
    return {
        id: request._id.toString(),
        caseId: request.caseId.toString(),
        accessionNumber: request.accessionNumber,
        discipline: request.discipline,
        code: request.code,
        name: request.name,
        status: request.status,
        priority: request.priority,
        requestedAt: (0, format_1.toIso)(request.requestedAt) ?? new Date().toISOString(),
        createdAt: (0, format_1.toIso)(request.createdAt) ?? new Date().toISOString(),
        updatedAt: (0, format_1.toIso)(request.updatedAt) ?? new Date().toISOString(),
    };
}
function toLab(lab) {
    return {
        id: lab._id.toString(),
        code: lab.code,
        name: lab.name,
        address: lab.address,
        phone: lab.phone,
        email: lab.email,
        accessionPrefix: lab.accessionPrefix,
        accessionFormat: lab.accessionFormat,
        tatHours: {
            FROZEN: lab.tatHours?.FROZEN ?? 1,
            URGENT: lab.tatHours?.URGENT ?? 24,
            ROUTINE: lab.tatHours?.ROUTINE ?? 72,
        },
        tatWarningPercent: lab.tatWarningPercent ?? 80,
        timezone: lab.timezone ?? 'Africa/Lagos',
        qaSamplingPercent: lab.qaSamplingPercent ?? 10,
        currency: lab.currency ?? 'NGN',
        enabledDisciplines: [...(lab.enabledDisciplines ?? ['HISTOPATHOLOGY'])],
        accessionPrefixes: { ...(lab.accessionPrefixes ?? {}) },
        organizationId: lab.organizationId?.toString() ?? null,
        onboardingCompletedAt: (0, format_1.toIso)(lab.onboardingCompletedAt),
        letterhead: {
            phone: lab.letterhead?.phone ?? null,
            email: lab.letterhead?.email ?? null,
            website: lab.letterhead?.website ?? null,
            pathologistName: lab.letterhead?.pathologistName ?? null,
            pathologistTitle: lab.letterhead?.pathologistTitle ?? null,
            qualifications: lab.letterhead?.qualifications ?? null,
            signatureText: lab.letterhead?.signatureText ?? null,
            footerNote: lab.letterhead?.footerNote ?? null,
        },
        active: lab.active,
        createdAt: (0, format_1.toIso)(lab.createdAt) ?? new Date().toISOString(),
    };
}
function dateOnly(value) {
    return value ? value.toISOString().slice(0, 10) : null;
}
function toPatientSummary(patient) {
    return {
        id: patient._id.toString(),
        mrn: patient.mrn,
        firstName: patient.firstName,
        lastName: patient.lastName,
        sex: patient.sex,
        dateOfBirth: dateOnly(patient.dateOfBirth),
        age: patient.age,
    };
}
function toPatient(patient) {
    return {
        ...toPatientSummary(patient),
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        nationalId: patient.nationalId,
        nextOfKin: patient.nextOfKin
            ? {
                name: patient.nextOfKin.name,
                phone: patient.nextOfKin.phone,
                relationship: patient.nextOfKin.relationship,
            }
            : null,
        createdAt: (0, format_1.toIso)(patient.createdAt) ?? new Date().toISOString(),
    };
}
function toSpecimen(specimen) {
    return {
        id: specimen._id.toString(),
        caseId: specimen.caseId.toString(),
        sequence: specimen.sequence,
        label: specimen.label,
        barcode: specimen.barcode,
        specimenType: specimen.specimenType,
        site: specimen.site,
        laterality: specimen.laterality,
        description: specimen.description,
        collectedAt: (0, format_1.toIso)(specimen.collectedAt),
        receivedAt: (0, format_1.toIso)(specimen.receivedAt) ?? new Date().toISOString(),
        grossDescription: specimen.grossDescription,
        status: specimen.status,
        currentStation: specimen.currentStation,
        rejectionReason: specimen.rejectionReason,
        rejectionCode: specimen.rejectionCode ?? null,
        createdAt: (0, format_1.toIso)(specimen.createdAt) ?? new Date().toISOString(),
    };
}
function toWsiInfo(slide) {
    if (!slide.wsiStatus)
        return null;
    return {
        status: slide.wsiStatus,
        url: slide.wsiUrl ?? null,
        viewerUrl: slide.wsiViewerUrl ?? null,
        scanner: slide.wsiScanner ?? null,
        magnification: slide.wsiMagnification ?? null,
        addedAt: (0, format_1.toIso)(slide.wsiAddedAt),
        addedBy: slide.wsiAddedBy ? slide.wsiAddedBy.toString() : null,
        metadata: (slide.wsiMetadata ?? {}),
    };
}
function toCustodyEvent(event) {
    return {
        id: event._id.toString(),
        entityType: event.entityType,
        entityId: event.entityId.toString(),
        caseId: event.caseId ? event.caseId.toString() : null,
        eventType: event.eventType,
        station: event.station,
        fromState: event.fromState,
        toState: event.toState,
        reason: event.reason,
        userId: event.userId.toString(),
        userName: event.userName,
        userRole: event.userRole ?? 'TECHNOLOGIST',
        timestamp: (0, format_1.toIso)(event.timestamp) ?? new Date().toISOString(),
        metadata: (event.metadata ?? {}),
    };
}
function toReportSummary(report) {
    return {
        id: report._id.toString(),
        status: report.status,
        version: report.version,
        signedOutAt: (0, format_1.toIso)(report.signedOutAt),
        amendedAt: (0, format_1.toIso)(report.amendedAt),
        releasedAt: (0, format_1.toIso)(report.releasedAt),
    };
}
function toReportVersion(version, createdBy) {
    return {
        id: version._id.toString(),
        version: version.version,
        action: version.action,
        data: version.data,
        narrative: version.narrative,
        reason: version.reason,
        createdBy: createdBy ? toUserSummary(createdBy) : null,
        createdAt: (0, format_1.toIso)(version.createdAt) ?? new Date().toISOString(),
    };
}
function toReportDetail(report, signedOutBy, versions, releasedBy = null) {
    const snapshot = report.protocolSnapshot;
    return {
        id: report._id.toString(),
        caseId: report.caseId.toString(),
        status: report.status,
        protocol: {
            id: snapshot.protocolId,
            key: snapshot.key,
            title: snapshot.title,
            cancerType: snapshot.cancerType,
            subspecialty: snapshot.subspecialty,
            version: snapshot.version,
            content: snapshot.content,
        },
        protocolVersion: report.protocolVersion,
        data: report.data,
        narrative: report.narrative,
        version: report.version,
        requiredComplete: report.requiredComplete,
        missingRequired: [...report.missingRequired],
        signedOutBy: signedOutBy ? toUserSummary(signedOutBy) : null,
        signedOutAt: (0, format_1.toIso)(report.signedOutAt),
        amendedAt: (0, format_1.toIso)(report.amendedAt),
        amendmentReason: report.amendmentReason,
        verificationCode: report.verificationCode,
        coding: (report.coding ?? {
            snomedCode: null,
            snomedDisplay: null,
            icdo3MorphologyCode: null,
            icdo3MorphologyDisplay: null,
            icdo3TopographyCode: null,
            icdo3TopographyDisplay: null,
        }),
        releasedAt: (0, format_1.toIso)(report.releasedAt),
        releasedBy: releasedBy ? toUserSummary(releasedBy) : null,
        createdAt: (0, format_1.toIso)(report.createdAt) ?? new Date().toISOString(),
        updatedAt: (0, format_1.toIso)(report.updatedAt) ?? new Date().toISOString(),
        versions,
    };
}
function toCaseListItem(caseDoc, patient, pathologist, report, disciplines = ['HISTOPATHOLOGY']) {
    return {
        id: caseDoc._id.toString(),
        accessionNumber: caseDoc.accessionNumber,
        disciplines,
        patient: toPatientSummary(patient),
        priority: caseDoc.priority,
        priorityRank: caseDoc.priorityRank,
        status: caseDoc.status,
        subspecialty: caseDoc.subspecialty,
        referringClinician: {
            name: caseDoc.referringClinician.name,
            facility: caseDoc.referringClinician.facility,
            phone: caseDoc.referringClinician.phone,
            email: caseDoc.referringClinician.email,
            referrerUserId: caseDoc.referringClinician.referrerUserId
                ? caseDoc.referringClinician.referrerUserId.toString()
                : null,
        },
        assignedPathologist: pathologist ? toUserSummary(pathologist) : null,
        receivedAt: (0, format_1.toIso)(caseDoc.receivedAt) ?? new Date().toISOString(),
        tatDeadline: (0, format_1.toIso)(caseDoc.tatDeadline) ?? new Date().toISOString(),
        reportedAt: (0, format_1.toIso)(caseDoc.reportedAt),
        amendedAt: (0, format_1.toIso)(caseDoc.amendedAt),
        tatBreachedAt: (0, format_1.toIso)(caseDoc.tatBreachedAt),
        summary: {
            specimenCount: caseDoc.summary?.specimenCount ?? 0,
            blockCount: caseDoc.summary?.blockCount ?? 0,
            slideCount: caseDoc.summary?.slideCount ?? 0,
        },
        report: report ? toReportSummary(report) : null,
        createdAt: (0, format_1.toIso)(caseDoc.createdAt) ?? new Date().toISOString(),
    };
}
function toAuditLog(log) {
    return {
        id: log._id.toString(),
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        caseId: log.caseId,
        userId: log.userId ? log.userId.toString() : null,
        userName: log.userName,
        userRole: log.userRole,
        before: log.before,
        after: log.after,
        metadata: (log.metadata ?? {}),
        ip: log.ip,
        userAgent: log.userAgent,
        requestId: log.requestId,
        createdAt: (0, format_1.toIso)(log.createdAt) ?? new Date().toISOString(),
    };
}
//# sourceMappingURL=entities.js.map