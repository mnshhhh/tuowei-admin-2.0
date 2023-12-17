<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="{ pageSize: 8 }"
    v-model:current="current"
    :total="500"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span class="nameCow">
          <smile-outlined />
          &ensp;用户姓名
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a-divider type="vertical" />
        {{ record.name }}
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag == '医生' ? 'green' : 'volcano'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-tooltip>
            <template #title>删除账户</template>
            <a @click="deleteUser(record.id)">删除</a>
          </a-tooltip>
          <a-divider type="vertical" class="mar" />
          <a-tooltip>
            <template #title>更多功能待开发</template>
            <a class="ant-dropdown-link">
              更多
              <down-outlined />
            </a>
          </a-tooltip>
        </span>
      </template>
    </template>
  </a-table>
  <!-- <a-pagination v-model:current="current" :total="500" /> -->
</template>
<script lang="ts">
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { detele, get } from "@/request/request";

export default defineComponent({
  components: { SmileOutlined, DownOutlined },
  props: {
    searchName: {
      type: String,
    },
  },
  setup(props) {
    const current = ref(1);
    const token: any = localStorage.getItem("token");
    const type: any = localStorage.getItem("type");
    const columns = [
      {
        name: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "账号",
        dataIndex: "account",
        key: "account",
      },
      {
        title: "职位",
        key: "tags",
        dataIndex: "tags",
      },
      {
        title: "功能",
        key: "action",
      },
    ];

    const data = reactive([
      {
        key: "1",
        name: "暂无",
        id: "暂无",
        account: "暂无",
        tags: ["医生"],
      },
    ]);
    const deleteUser = async (id: any) => {
      try {
        const token: any = localStorage.getItem("token");
        const res: any = await detele(
          "/user/delete?userId=" + id.toString(),
          token
        );
        console.log("1", id);
        if (res.code == 1) {
          message.success(res.msg);
          location.reload();
        } else {
          message.info(res.msg);
        }
      } catch {
        message.info("删除失败，请重试");
      }
    };
    watch(
      () => props.searchName,
      async () => {
        data.length = 0;
        data.push({
          key: "1",
          name: "暂无",
          id: "暂无",
          account: "暂无",
          tags: ["医生"],
        });
        try {
          const res: any = await get(
            "/user/list?page=1&pageSize=1000&name=" + props.searchName,
            token
          );
          if (res.code == 1 && type == "2" && res.data.total) {
            for (let i = 0; i < res.data.total; i++) {
              if (res.data.records[i].type == 1) {
                if (res.data.records[i].name) {
                  data.push({
                    key: res.data.records[i].id,
                    name: res.data.records[i].name,
                    id: res.data.records[i].id,
                    account: res.data.records[i].username,
                    tags: ["医生"],
                  });
                } else {
                  data.push({
                    key: res.data.records[i].id,
                    name: "null",
                    id: res.data.records[i].id,
                    account: res.data.records[i].username,
                    tags: ["医生"],
                  });
                }
              } else if (res.data.records[i].type == 0) {
                if (res.data.records[i].name) {
                  data.push({
                    key: res.data.records[i].id,
                    name: res.data.records[i].name,
                    id: res.data.records[i].id,
                    account: res.data.records[i].username,
                    tags: ["病人"],
                  });
                } else {
                  data.push({
                    key: res.data.records[i].id,
                    name: "null",
                    id: res.data.records[i].id,
                    account: res.data.records[i].username,
                    tags: ["病人"],
                  });
                }
              }
            }
            data.shift();
          }
        } catch {
          console.log("获取医生信息失败");
        }
      }
    );
    onMounted(async () => {
      try {
        const res: any = await get("/user/list?page=1&pageSize=1000", token);
        if (res.code == 1 && type == "2" && res.data.total) {
          for (let i = 0; i < res.data.total; i++) {
            if (res.data.records[i].type == 1) {
              console.log("yisheng", res.data.records[i]);
              if (res.data.records[i].name) {
                data.push({
                  key: res.data.records[i].id,
                  name: res.data.records[i].name,
                  id: res.data.records[i].id,
                  account: res.data.records[i].username,
                  tags: ["医生"],
                });
              } else {
                data.push({
                  key: res.data.records[i].id,
                  name: "null",
                  id: res.data.records[i].id,
                  account: res.data.records[i].username,
                  tags: ["医生"],
                });
              }
            } else if (res.data.records[i].type == 0) {
              if (res.data.records[i].name) {
                data.push({
                  key: res.data.records[i].id,
                  name: res.data.records[i].name,
                  id: res.data.records[i].id,
                  account: res.data.records[i].username,
                  tags: ["病人"],
                });
              } else {
                data.push({
                  key: res.data.records[i].id,
                  name: "null",
                  id: res.data.records[i].id,
                  account: res.data.records[i].username,
                  tags: ["病人"],
                });
              }
            }
          }
          data.shift();
        }
      } catch {
        console.log("获取医生信息失败");
      }
    });
    return {
      columns,
      data,
      current,
      deleteUser,
    };
  },
});
</script>
<style lang="less" scoped>
.nameCow {
  text-align: center;
}
.mar {
  margin: 0 5px;
}
</style>
