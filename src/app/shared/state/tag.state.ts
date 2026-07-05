import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { AdvanceDropDownFormat, Select2DataFormat } from "@shared/interface";
import {
  CreateTag,
  EditTag,
  GetTags,
  GetTagsToSelect,
  ResetLoaderStateAction,
  UpdateTag,
} from "@shared/action";
import { Tag, TagToSelect } from "../interface/tag.interface";
import { of, tap } from "rxjs";

import { Injectable } from "@angular/core";
import { NotificationService } from "../services/notification.service";
import { Router } from "@angular/router";
import { TagService } from "../services/tag.service";

export class TagStateModel {
  tag = {
    datos: [] as Tag[],
    total: 0,
  };
  tagSelect = {
    datos: [] as TagToSelect[],
  };
  selectedTag: Tag | null;
}

@State<TagStateModel>({
  name: "tag",
  defaults: {
    tag: {
      datos: [],
      total: 0,
    },
    tagSelect: {
      datos: [],
    },
    selectedTag: null,
  },
})
@Injectable()
export class TagState {
  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private tagService: TagService,
    private router: Router
  ) { }

  @Selector()
  static tag(state: TagStateModel) {
    return state.tag;
  }

  @Selector()
  static selectedTag(state: TagStateModel) {
    return state.selectedTag;
  }

  // @Selector()
  // static selectTagToSelect(state: TagStateModel): Select2DataFormat<{}>[] {
  //   return state.tagSelect.datos.map((role) => {
  //     return {
  //       value: role.code,
  //       label: role.name,
  //       other: {},
  //     };
  //   });
  // }

  @Selector()
  static selectAdvancedDropDown(state: TagStateModel): AdvanceDropDownFormat<null>[] {
    return state.tagSelect.datos.map(tag => {
      return { name: tag?.name, code: tag?.code, selected: false,  other: null }
    })
  }

  @Action(GetTags)
  getTags(ctx: StateContext<TagStateModel>, { payload }: GetTags) {
    return this.tagService.getTags(payload).pipe(
      tap({
        next: (result) => {
          ctx.patchState({
            tag: {
              datos: result.datos.datos,
              total: result.datos.count,
            },
          });
        },
        error: (err) => {
          if (err?.error?.message) {
            throw new Error(err?.error?.message);
          }
        },
      })
    );
  }

  @Action(CreateTag)
  create(ctx: StateContext<TagStateModel>, { payload }: CreateTag) {
    return this.tagService.createTag(payload).pipe(
      tap({
        next: (result) => {
          if (result.datos === null && result.result === null) {
            this.store.dispatch(new ResetLoaderStateAction());
            throw new Error();
          }
          ctx.patchState({
            tag: {
              datos: [...ctx.getState().tag.datos, result.datos],
              total: ctx.getState().tag.total + 1,
            },
          });

          this.notificationService.showSuccess(result.result.detail);
        },
        error: (err) => {
          this.store.dispatch(new ResetLoaderStateAction());
          this.router.navigate(["/tags"]);
          if (err?.error?.message) {
            throw new Error(err?.error?.message);
          }
        },
      })
    );
  }

  @Action(EditTag)
  edit(ctx: StateContext<TagStateModel>, { payload }: EditTag) {
    return this.tagService.getTagById(payload).pipe(
      tap({
        next: (result) => {
          if (result.datos === null && result.result === null) {
            this.store.dispatch(new ResetLoaderStateAction());
            throw new Error();
          }
          const tags = ctx.getState().tag.datos;
          const index = tags.findIndex((tag) => tag.code === result.datos.code);
          tags[index] = result.datos;

          ctx.patchState({
            ...ctx.getState(),
            selectedTag: result.datos,
          });
        },
        error: (err) => {
          this.store.dispatch(new ResetLoaderStateAction());
          this.router.navigate(["/tags"]);
          if (err?.error?.message) {
            throw new Error(err?.error?.message);
          }
        },
      })
    );
  }

  @Action(UpdateTag)
  update(ctx: StateContext<TagStateModel>, { payload, id }: UpdateTag) {
    return this.tagService.updateTag(payload, id).pipe(
      tap({
        next: (result) => {
          if (result.datos === null && result.result === null) {
            this.store.dispatch(new ResetLoaderStateAction());
            throw new Error();
          }
          ctx.patchState({
            tag: {
              datos: ctx
                .getState()
                .tag.datos.map((tag) => (tag.code === id ? result.datos : tag)),
              total: ctx.getState().tag.total,
            },
          });
          this.notificationService.showSuccess(result.result.detail);
        },
        error: (err) => {
          this.store.dispatch(new ResetLoaderStateAction());
          this.router.navigate(["/tags"]);
          if (err?.error?.message) {
            throw new Error(err?.error?.message);
          }
        },
      })
    );
  }

  @Action(GetTagsToSelect)
  getTagsToSelect(ctx: StateContext<TagStateModel>) {
    return this.tagService.getTagsToSelect().pipe(
      tap({
        next: (result) => {
          ctx.patchState({
            tagSelect: {
              datos: result.datos.datos.map((role) => {
                return {
                  code: role.code,
                  name: role.name,
                  selected: false,
                };
              }),
            },
          });
        },
        error: (err) => {
          if (err?.error?.message) {
            throw new Error(err?.error?.message);
          }
        },
      })
    );
  }

  // @Action(GetTagsToSelect)
  // getTagsToSelect(ctx: StateContext<TagStateModel>) {
  //   return this.tagService.getTagsToSelect().pipe(
  //     tap({
  //       next: result => {
  //         ctx.patchState({
  //           tagSelect: {
  //             datos: result.datos.datos
  //           }
  //         });
  //       },
  //       error: err => {
  //         if (err?.error?.message) {
  //           throw new Error(err?.error?.message);
  //         }
  //       }
  //     })
  //   );
  // }
}
